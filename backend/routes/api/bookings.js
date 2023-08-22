const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');
const sequelize = require('sequelize');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const booking = require('../../db/models/booking');

const validateBooking = [
    check('startDate')
    .exists({ checkFalsy: true })
    .withMessage("Must include a start date")
    .trim()
    .notEmpty()
    .withMessage("Must include a start date")
    .isDate("yyyy-mm-dd")
    .withMessage("Must enter a valid date"),
    check('endDate')
    .exists({ checkFalsy: true })
    .withMessage("Must include an end date")
    .trim()
    .notEmpty()
    .withMessage("Must include an end date")
    .isDate("yyyy-mm-dd")
    .withMessage("Must enter a valid date"),
    handleValidationErrors
]


//get all the booking that the current user has made

router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;

        const bookings = await Booking.findAll({
            where: {userId: userId},
            include : [
                {
                    model: Spot,
                    attributes: [
                        'id',
                        'ownerId',
                        'address',
                        'city',
                        'state',
                        'country',
                        'lat',
                        'lng',
                        'name',
                        'price'
                    ]
                }
            ]
        });

        for (let booking of bookings) {
            const spot = booking.Spot;
            const previewImage = await SpotImage.findOne({
                attributes: ["url"],
                where: {spotId: spot.id, preview: true}
            });

            if (previewImage) {
                spot.dataValues.previewImage = previewImage.url;
            }

        }

        return res.status(200).json({Bookings: bookings});
    }
);



    // edit a booking

    router.put(
        '/:bookingId',
        validateBooking,
    requireAuth,
    async (req, res, next) => {
        const userId = req.user.id;
        const { startDate, endDate } = req.body;
        const bookingId = req.params.bookingId;

        const booking = await Booking.findOne({ where: {id: bookingId}});

        if(!booking) {
           return res.status(404).json({message: "Booking couldn't be found"});
        }

        const currentDate = new Date();

        if (startDate < currentDate){
           return res.status(403).json({message: "Past bookings can't be modified"});
        }

        if (endDate < startDate) {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                    endDate: "endDate cannot come before startDate"
                }
            });
        }

        const err = {
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                    }
        }

        if (startDate <= booking.endDate && startDate >= booking.startDate ) return res.status(403).json(err);
        if (endDate <= booking.endDate && endDate >= booking.startDate) return res.status(403).json(err);
        if (endDate >= booking.endDate && startDate <= booking.startDate) return res.status(403).json(err);

        if (userId === booking.userId) {
           await booking.set({
                startDate,
                endDate
            });

            await booking.save();

            return res.status(200).json(booking);
        } else {
            return res.status(403).json({
                message: "Forbidden!"
            })
        }

    }
);

//delete a booking

router.delete(
    '/:bookingId',
    requireAuth,
    async (req, res, next) => {
        const { bookingId } = req.params;
        const { user } = req;
        const booking = await Booking.findByPk(bookingId);

        // booking couldnt be found
        if (!booking) {
            res.statusCode = 404;
            return res.json({ message: "Booking couldn't be found" })
        }

        const spot = await Spot.findByPk(booking.spotId);

        let spotOwner, bookOwner;
        if (spot.ownerId == user.id) spotOwner = true;
        else if (booking.userId == user.id) bookOwner = true;

        if (!bookOwner && !spotOwner) {
            res.statusCode = 401;
            return res.json({ message: "forbidden" });
        }

        // bookings that have been started cant be deleted
        if (booking.startDate <= curr) {
            res.statusCode = 403;
            return res.json({ message: "Bookings that have been started can't be deleted" })
        }

        await booking.destroy();
        return res.json({ "message": "Successfully deleted" })
    }
);


module.exports = router;
