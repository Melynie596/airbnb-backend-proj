const express = require('express');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, sequelize, SpotImage, Review, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { route } = require('./reviews');
const router = express.Router();

const validateSpot = [
    check('address')
        .exists({checkFalsy: true})
        .isString()
        .notEmpty()
        .trim()
        .withMessage('Street address is required'),
    check('city')
        .exists({checkFalsy: true})
        .isString()
        .notEmpty()
        .trim()
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .isString()
        .notEmpty()
        .trim()
        .withMessage('State is required'),
    check('country')
        .exists({checkFalsy: true})
        .isString()
        .notEmpty()
        .trim()
        .withMessage('Country is required'),
    check('lat')
        .exists({checkFalsy: true})
        .isNumeric()
        .notEmpty()
        .trim()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({checkFalsy: true})
        .isNumeric()
        .notEmpty()
        .trim()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({checkFalsy: true})
        .notEmpty()
        .trim()
        .isLength({max: 49})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({checkFalsy: true})
        .isString()
        .notEmpty()
        .trim()
        .withMessage('Description is required'),
    check('price')
        .exists({checkFalsy: true})
        .isCurrency()
        .withMessage('Price per day is required'),
    handleValidationErrors
];

// console.log(validateSpot);

// whitespace space errors


//get all spots
router.get(
    '/',
    async (req, res) => {

        let { page, size } = req.query;
        if (!page) page = 1;
        if (!size) size = 20;

        page = parseInt(page);
        size = parseInt(size);

        const pagination = {};

        if (page !== 0 && size !== 0) {
            pagination.limit = size;
            pagination.offset = size * (page - 1);
        }

        const spots = await Spot.findAll({
            attributes: [
                "id",
                "ownerId",
                "address",
                "city",
                "state",
                "country",
                "lat",
                "lng",
                "name",
                "description",
                "price",
                "createdAt",
                "updatedAt",
                "avgRating"

            ],
            ...pagination
        });

        return res.status(200).json({Spots: spots});
    }
);

//get spots of current user

router.get(
    '/users/:userId',
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;

        const spots = await Spot.findAll({
            where: { ownerId: userId}
        });


        return res.status(200).json({Spots: spots});
    }


);

//get details of a spot from an id

router.get(
    '/:spotId',
    async (req, res) => {
    //     const { spotId } = req.params.spotId;

    //     const spot = await Spot.findOne(
    //         {
    //         where: {id: spotId},
    //         include: [
    //             {
    //                 model: 'spotImages',
    //                 attributes: ['id', 'url', 'preview']
    //             },
    //             {
    //                 model: 'User',
    //                 as: 'Owner',
    //                 attributes: ['id', 'firstName', 'lastName']
    //             }
    //         ]
    //     });

    //     if(!spot) {
    //         return res.status(404).json({
    //             message: "Spot couldn't be found"
    //         })
    //     }

    //     return res.status(200).json(spot);
    // }
    const spotId = req.params.spotId;

    const spot = await Spot.findOne({
        where: {
            id: spotId,
        },
        include: [
            {
                model: Review,
                attributes: [],
            },
            {
                model: SpotImage,
                attributes: ["id", "url", "preview"],
            },
            {
                model: User,
                as: "Owner",
                attributes: ["id", "firstName", "lastName"],
            },
        ],
        attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "description", "price", "createdAt", "updatedAt",
            [sequelize.fn("COUNT", sequelize.col("Reviews.id")), "numReviews"],
            [sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1),
                "avgRating",],
        ],
        group: ["SpotImages.id", "Spot.id", "Owner.id"]
    });

    if (spot) {
        return res.status(200).json(spot);
    } else {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }
});

//create a spot

router.post(
    '/',
    validateSpot,
    requireAuth,
    async(req, res, next) => {

        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const ownerId = req.user.id;

        const spot = await Spot.create({
                ownerId: ownerId,
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price
        });

        return res.status(201).json(spot);
    }
);

// create image for a spot based on spot id
// creates image for a spot that doesnt exists

router.post(
    '/:spotId/images',
    requireAuth,
    async(req, res, next) => {
        const spotId = req.params.spotId;
        const userId = req.user.id;
        const { url, preview } = req.body;

        if (!spotId) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        const spot = await Spot.findOne({ where : {ownerId: userId}});

        if (userId === spot.ownerId) {
            const addImage = await SpotImage.create({
                    url,
                    preview,
                    spotId: spotId
                 });

            const image = {
                id: addImage.id,
                url: addImage.url,
                preview: addImage.preview
            }

             return res.status(200).json(image);
        } else {
            return res.status(403).json({
                message: "Forbidden!"
            })
        }

    }
);


//get details of a spot from an id

router.get(
    '/:spotId',
    async (req, res) => {
    //     const { spotId } = req.params.spotId;

    //     const spot = await Spot.findOne(
    //         {
    //         where: {id: spotId},
    //         include: [
    //             {
    //                 model: 'spotImages',
    //                 attributes: ['id', 'url', 'preview']
    //             },
    //             {
    //                 model: 'User',
    //                 as: 'Owner',
    //                 attributes: ['id', 'firstName', 'lastName']
    //             }
    //         ]
    //     });

    //     if(!spot) {
    //         return res.status(404).json({
    //             message: "Spot couldn't be found"
    //         })
    //     }

    //     return res.status(200).json(spot);
    // }
    const spotId = req.params.spotId;

    const spot = await Spot.findOne({
        where: {
            id: spotId,
        },
        include: [
            {
                model: Review,
                attributes: [],
            },
            {
                model: SpotImage,
                attributes: ["id", "url", "preview"],
            },
            {
                model: User,
                as: "Owner",
                attributes: ["id", "firstName", "lastName"],
            },
        ],
        attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "description", "price", "createdAt", "updatedAt",
            [sequelize.fn("COUNT", sequelize.col("Reviews.id")), "numReviews"],
            [sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1),
                "avgRating",],
        ],
        group: ["SpotImages.id", "Spot.id", "Owner.id"]
    });

    if (spot) {
        return res.status(200).json(spot);
    } else {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }
});

//edit a spot

router.put(
    '/:spotId',
    requireAuth,
    validateSpot,
    async(req, res, next) => {
        const userId = req.user.id;
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const spotId = req.params.spotId;

        const spot = await Spot.findOne({
            where: {id: spotId}
        });

        if(!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }
        if (userId === spot.ownerId) {
            spot.set({
                address: address,
                city: city,
                state: state,
                country: country,
                lat: lat,
                lng: lng,
                name: name,
                description: description,
                price: price
            });

            await spot.save();

            return res.status(200).json(spot);

        } else {
            return res.status(403).json({
                message: "forbidden!"
            })
        }

    }
);

// delete a spot image
router.delete(
    '/:spotId/:imageId',
    requireAuth,
    async (req, res, next) => {
        const userId = req.user.id;
        const spotId = req.params.spotId;
        const imageId = req.params.imageId;

        const image = await SpotImage.findOne({ where : {
            id: imageId,
            spotId: spotId
        }});

        const spot = await Spot.findOne({where : {id: spotId}})

        if (!image) {
           return res.status(404).json({
            message: "Spot Image couldn't be found"
           })
        }

        if (userId === spot.ownerId) {
            await image.destroy();

            res.status(200).json({message: "successfully deleted"});
        }
        else {
            return res.status(403).json({
                message: "Forbidden!"
            })
        }
    }
)

//delete a spot
router.delete(
    '/:spotId',
    requireAuth,
    async(req, res, next) => {
        const userId = req.user.id;
        const spotId = req.params.spotId;

        const spot = await Spot.findOne({ where: {id: spotId} });

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        if (userId === spot.ownerId) {
            await spot.destroy();
            res.status(200).json({message: "successfully deleted"});
        }
        else {
            return res.status(403).json({
                message: "Forbidden!"
            })
        }
    }
)


module.exports = router;
