const express = require('express');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, sequelize, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { route } = require('./reviews');
const router = express.Router();

const validateSpot = [
    check('address')
        .exists({checkFalsy: true})
        .isString()
        .withMessage('Street address is required'),
    check('city')
        .exists({checkFalsy: true})
        .isString()
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .isString()
        .withMessage('State is required'),
    check('country')
        .exists({checkFalsy: true})
        .isString()
        .withMessage('Country is required'),
    check('lat')
        .exists({checkFalsy: true})
        .isNumeric()
        .withMessage('Latitude is required'),
    check('lng')
        .exists({checkFalsy: true})
        .isNumeric()
        .withMessage('Longitude is required'),
    check('name')
        .exists({checkFalsy: true})
        .isLength({max: 49})
        .withMessage('Namem must be less than 50 characters'),
    check('description')
        .exists({checkFalsy: true})
        .isString()
        .withMessage('Description is required'),
    check('price')
        .exists({checkFalsy: true})
        .isCurrency()
        .withMessage('Price per day is required'),
    handleValidationErrors
];

//get all spots
router.get(
    '/',
    async (req, res) => {

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

            ]
        });

        return res.status(200).json({Spots: spots});
    }
);

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

router.post(
    '/:spotId/images',
    requireAuth,
    async(req, res, next) => {
        const spotId = req.params.spotId;
        const { url, preview } = req.body;

        if (!spotId) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        const addImage = await spotImage.create({
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

    }
);

//get spots of current user

router.get(
    '/:userId',
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
        const { spotId } = req.params.spotId;

        const spot = await Spot.findByPk(spotId, {
            include: [
                {
                    model: 'spotImages',
                    attributes: ['id', 'url', 'preview']
                },
                {
                    model: 'User',
                    as: 'Owner',
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });

        if(!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        return res.status(200).json(spot);
    }
);

//edit a spot

router.put(
    '/:spotId',
    requireAuth,
    validateSpot,
    async(req, res, next) => {
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

    }
);

// delete a spot image
router.delete(
    '/:spotId/:imageId',
    requireAuth,
    async (req, res, next) => {
        const spotId = req.params.spotId;
        const imageId = req.params.imageId;

        const image = await spotImage.findOne({ where : {
            id: imageId,
            spotId: spotId
        }});

        if (!image) {
           return res.status(404).json({
            message: "Spot Image couldn't be found"
           })
        }

        image.destroy();

        res.status(200).json({message: "successfully deleted"});
    }
)

//delete a spot
router.delete(
    '/:spotId',
    requireAuth,
    async(req, res, next) => {
        const spotId = req.params.spotId;

        const spot = await Spot.findOne({ where: {id: spotId} });

        await spot.destroy();

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        res.status(200).json({message: "successfully deleted"});
    }
)


module.exports = router;
