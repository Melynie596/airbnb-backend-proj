const express = require('express');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, sequelize, SpotImage, Review, User, Booking, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { route } = require('./reviews');
const router = express.Router();

const validateSpot = [
    check('address')
        .trim()
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Street address is required')
        .isString(),
    check('city')
        .trim()
        .notEmpty()
        .withMessage('City is required')
        .isString()
        .exists({checkFalsy: true}),
    check('state')
        .trim()
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('State is required')
        .isString(),
    check('country')
        .trim()
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Country is required')
        .isString(),
    check('lat')
        .trim()
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Latitude is not valid'),
        // .custom(lat => {
        //     if (lat < -90 || lng > 90 ) {
        //         throw new Error('Latitude is not valid')
        //     }
        // }),
    check('lng')
        .trim()
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Longitude is not valid'),
        // .custom(lng => {
        //     if (lng < -180 || lng > 180 ) {
        //         throw new Error('Longitude is not valid')
        //     }
        // }),
    check('name')
        .trim()
        .exists({checkFalsy: true})
        .notEmpty().withMessage('Name is required')
        .isLength({max: 49})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .trim()
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Description is required')
        .isString(),
    check('price')
        .exists({checkFalsy: true})
        .isCurrency()
        .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReview = [
    check('review')
    .trim()
    .notEmpty()
    .withMessage('Review text is required')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
    check('stars')
    .exists({ checkFalsy: true })
    .isInt(
       {
        min: 1,
        max: 5
        }
    )
    .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

//SPOTS
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

            include: [
                {
                    model: Review,
                    attributes: [],
                },
                {
                    model: SpotImage,
                    as: "previewImage",
                    attributes: ["url"]
                }
            ],
            attributes: [
                "id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "description", "price", "createdAt", "updatedAt",
                [sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1), "avgRating"],
            ],
            group:  ["Spot.id"]
        });

        return res.status(200).json({Spots: spots});
    }
);

//get spots of current user

router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;

        const spots = await Spot.findAll({
            where: { ownerId: userId},
            include: [
                {
                    model: Review,
                    attributes: []
                }
            ],
            attributes: [
                "id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "description", "price", "createdAt", "updatedAt",
                [sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1), "avgRating"],
            ],
            group:  ["Spot.id"]
        });


        return res.status(200).json({Spots: spots});
    }


);

//get details of a spot from an id

router.get(
    '/:spotId',
    async (req, res) => {

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
            [sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1), "avgRating"],
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

        await spot.save()

        return res.status(201).json(spot);
    }
);

// create image for a spot based on spot id

router.post(
    '/:spotId/images',
    requireAuth,
    async(req, res, next) => {
        const spotId = req.params.spotId;
        const userId = req.user.id;
        const { url, preview } = req.body;

        const spot = await Spot.findOne({ where : {id: spotId}});

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }


        if (userId === spot.ownerId) {
            const addImage = await SpotImage.create({
                    url,
                    preview,
                    spotId: spotId
                 });

                 await addImage.save()

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

//REVIEWS BY SPOT
// get all reviews by a spot id

router.get(
    '/:spotId/reviews',
    async(req, res, next) => {
        const spotId = req.params.spotId;

        const reviews = await Review.findAll({
            where: { spotId: spotId},
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        if(reviews.length === 0) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        return res.status(200).json({Reviews: reviews})
    }
);

//create a review for a spot based on the spots id

router.post(
    '/:spotId/reviews',
    requireAuth,
    validateReview,
    async (req, res, next) => {
        const spotId = req.params.spotId;
        const userId = req.user.id;
        const { review, stars } = req.body;

        const spot = await Spot.findOne({where: {id: spotId}});

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        const existingReview = await Review.findOne({where: {
            userId: userId,
            spotId: spotId
        }});

        if (existingReview) {
          return res.status(500).json({
            message: "User already has a review for this spot"
          })
        }

            const newReview = await Review.create({
                userId: userId,
                spotId: Number(spotId),
                review,
                stars
            });

            await newReview.save();

            return res.status(201).json(newReview);



    }
);


//BOOKINGS BY SPOT
//get all bookings for a spot based on the spot id

router.get(
    '/:spotId/bookings',
    requireAuth,
    async (req, res, next) => {
        const spotId = req.params.spotId;
        const userId = req.user.id;


        // if user is NOT the owner of the spot

        const nonOwnerBooking = await Booking.findAll({
                where: {spotId: spotId},
                attributes: [
                    'spotId',
                    'startDate',
                    'enddate'
                ]
            });



            // if user IS the owner of the spot
            const ownerBooking = await Booking.findAll({
                where: {spotId: spotId},
                include: [
                    { model: 'User',
                    attributes: [
                        'id',
                        'firstName',
                        'lastname'
                    ]
                },
            ]
        });

        if (nonOwnerBooking.length === 0 || ownerBooking.length === 0) {
           return res.status(404).json({
            message: "Spot couldn't be found"
           })
        }

        for (let bookings of nonOwnerBooking) {
            if (userId !== bookings.userId){
                return res.status(200).json({Bookings: nonOwnerBooking});
            }
        }

        for (let bookings of ownerBooking) {
            if (userId === bookings.userId) {
                return res.status(200).json({Bookings: booking});
            }
        }

    }
);


//create a booking from a spot based on the spots id

router.post(
    '/:spotId/bookings',
    requireAuth,
    async(req, res, next) => {
        const { startDate, endDate } = req.body;
        const spotId = req.params.spotId;
        const userId = req.user.id;

        const spot = await Spot.findOne({where: {id: spotId}});

        const newBooking = await Booking.create({
            userId: userId,
            spotId: Number(spotId),
            startDate,
            endDate
        });

        if (newBooking.startDate >= newBooking.endDate) {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                    endDate: "endDate cannot be on or before startDate"
                }
            })
        }

        if (!spot) {
            return res.status(404).json({message: "Spot couldn't be found"});
        }

        const allBookings = await Booking.findAll();

        for (let booking of allBookings){
            const existingStartDate = booking.startDate;
            const existingEndDate = booking.endDate;

            if (existingStartDate === startDate || existingEndDate === endDate ){
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    errors: {
                        startDate: "Start date conflicts with an existing booking",
                        endDate: "End date conflicts with an existing booking"
                    }
                })
            }
        }



        if (spot.ownerId === userId){
            await newBooking.save();
            return res.status(200).json(newBooking);
        } else {
            return res.status(400).json({message: "Spots must not belong to the current user"});
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
            res.status(200).json({message: "Successfully deleted"});
        }
        else {
            return res.status(403).json({
                message: "Forbidden!"
            })
        }
    }
)


module.exports = router;
