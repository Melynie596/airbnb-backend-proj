const express = require('express');
const {Sequelize, Op} = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, sequelize, SpotImage, Review, User, Booking, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { route } = require('./reviews');
const router = express.Router();

const validateSpot = [
    check('address')
    .exists({checkFalsy: true})
    .withMessage('Street address is required')
        .trim()
        .notEmpty()
        .withMessage('Street address is required')
        .isString()
        .withMessage('Street address is required'),
    check('city')
    .exists({checkFalsy: true})
    .withMessage('City is required')
        .trim()
        .notEmpty()
        .withMessage('City is required')
        .isString()
        .withMessage('City is required'),
    check('state')
    .exists({checkFalsy: true})
    .withMessage('State is required')
        .trim()
        .notEmpty()
        .withMessage('State is required')
        .isString()
        .withMessage('State is required'),
    check('country')
    .exists({checkFalsy: true})
    .withMessage('Country is required')
        .trim()
        .notEmpty()
        .withMessage('Country is required')
        .isString()
        .withMessage('Country is required'),
    check('lat')
    .exists({checkFalsy: true})
    .withMessage('Latitude is not valid')
        .trim()
        .notEmpty()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({checkFalsy: true})
        .withMessage('Longitude is not valid')
        .trim()
        .notEmpty()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({checkFalsy: true})
        .withMessage('Name must be less than 50 characters')
        .trim()
        .notEmpty().withMessage('Name must be less than 50 characters')
        .isLength({max: 49})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({checkFalsy: true})
        .withMessage('Description is required')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description is required'),
    check('price')
        .exists({checkFalsy: true})
        .withMessage('Price per day is required')
        .isCurrency()
        .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReview = [
    check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required')
    .trim()
    .notEmpty()
    .withMessage('Review text is required'),
    check('stars')
    .exists({ checkFalsy: true })
    .withMessage('Stars must be an integer from 1 to 5')
    .trim()
    .notEmpty()
    .withMessage('Stars must be an integer from 1 to 5')
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
    async (req, res, next) => {

        let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

        if (!page) page = 1;
        if (!size) size = 20;
        if (page > 10) size = 1;
        if (size > 20) size = 20;
        page = parseInt(page);
        size = parseInt(size);

        let pag = {};

        if (page !== 0 && size !==0) {
            pag.limit = size;
            pag.offset = size * (page - 1);
        }

        const where = {};

        if (minPrice) where.price = {[Op.gte]: maxPrice};
        if (maxPrice) where.price = {...where.price, [Op.lte]: maxPrice};
        if (minLat) where.lat = {[Op.gte]: minLat};
        if (maxLat) where.lat = {...where.lat, [Op.lte]: maxLat};
        if (minLng) where.lng = {[Op.gte]: minLng};
        if (maxLng) where.lng = {...where.lng, [Op.lte]: maxLng};

        let results = {};

        const spots = await Spot.findAll({
            include: [
                {
                    model: Review,
                    attributes: []
                }
            ],
            where,
            ...pag,
        });

        for (let spot of spots) {
            const previewImage = await SpotImage.findOne({
                attributes: ["url"],
                where: {spotId: spot.id, preview: true}
            });

            if (previewImage) spot.dataValues.previewImage = previewImage.dataValues.url;

            const spotRating = await Spot.findByPk(spot.id, {
                include: [
                    {
                        model: Review,
                        attributes: [],
                    }
                ],
                attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "description", "price", "createdAt", "updatedAt",
                            Number([sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1), "avgRating"]) ],
                group: ["Spot.id"]
            });

            const avgRating = spotRating.dataValues.avgRating;

            if (spotRating) spot.dataValues.avgRating = avgRating;

            results.Spots = spots;
            return res.status(200).json({
                Spots: spots,
                page: page,
                size: size
            });
        }

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
                },
                {
                    model: SpotImage,
                    attributes: []
                }
            ],
            attributes: [
                "id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "description", "price", "createdAt", "updatedAt",
                Number([sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1), "avgRating"]),
                [sequelize.col("SpotImages.url"), "previewImage"]
            ],
            group:  ["Spot.id", "SpotImages.url"]
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
            Number([sequelize.fn("COUNT", sequelize.col("Reviews.id")), "numReviews"]),
            Number([sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 1), "avgRating"]),
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
    async(req, res) => {

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
                lat: Number(lat),
                lng: Number(lng),
                name: name,
                description: description,
                price: price
            });

            await spot.save();

            return res.status(200).json(spot);

        } else {
            return res.status(403).json({
                message: "Forbidden!"
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

        const spot = await Spot.findOne({
            where: {id: spotId}
        });

        if (!spot) {
            return res.status(404).json({message: "Spot couldn't be found"});
        }

        if (spot.ownerId === userId){
                       // if user IS the owner of the spot
                       const ownerBooking = await Booking.findAll({
                        where: {spotId: spotId},
                        include: [
                        {   model: User,
                            attributes: [
                                'id',
                                'firstName',
                                'lastName'
                            ]
                        },
                    ]
                });

                return res.status(200).json({Bookings: ownerBooking});
        } else {
            //if user is NOT the owner of the spot

        const nonOwnerBooking = await Booking.findAll({
            where: {spotId: spotId},
            attributes: [
                'spotId',
                'startDate',
                'endDate'
            ]
        });

        return res.status(200).json({Bookings: nonOwnerBooking});
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
        const bookingStartDate = new Date(startDate);
        const bookingEndDate = new Date(endDate);

        const spot = await Spot.findOne({where: {id: spotId}});

        if (!spot) {
            return res.status(404).json({message: "Spot couldn't be found"});
        }


        const allBookings = await Booking.findAll({
            where: {spotId: spotId}
        });



        for (let booking of allBookings){
            const existingStartDate = new Date(booking.startDate);
            const existingEndDate = new Date(booking.endDate);


            const err = {
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                        startDate: "Start date conflicts with an existing booking",
                        endDate: "End date conflicts with an existing booking"
                        }
            }

            if (bookingStartDate <= existingEndDate && bookingStartDate >= existingStartDate ) return res.status(403).json({err});
            if (bookingEndDate <= existingEndDate && bookingEndDate >= existingStartDate) return res.status(403).json({err});
            if (bookingEndDate >= existingEndDate && bookingStartDate <= existingStartDate) return res.status(403).json({err});

        }

        if (bookingStartDate >= bookingEndDate) {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                    endDate: "endDate cannot be on or before startDate"
                }
            })
        }

        const newBooking = await Booking.create({
            userId: userId,
            spotId: Number(spotId),
            startDate: bookingStartDate,
            endDate: bookingEndDate
        });

        if (spot.ownerId !== userId){
            await newBooking.save();
            return res.status(200).json(newBooking);
        } else {
            return res.status(400).json({message: "Forbidden!"});
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
