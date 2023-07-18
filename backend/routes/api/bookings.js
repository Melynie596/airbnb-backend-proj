const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot } = require('../../db/models');
const sequelize = require('sequelize');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const booking = require('../../db/models/booking');


//get all the booking that the current user has made

router.get(
    '/:userId',
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
                        'price',
                        'previewImage'
                    ]
                }
            ]
        });

        if (userId === req.params.userId) {
            return res.status(403).json({message: "Forbidden!"})
        }

        return res.status(200).json({Bookings: bookings});
    }
);

//get all bookings for a spot based on the spot id

router.get(
    '/:spotId',
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
    '/:spotId',
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
            return res.status(200).json(newBooking);
        } else {
            return res.status(400).json({message: "Spots must not belong to the current user"});
        }

    }

    );

    // edit a booking

    router.put(
        '/:bookingId',
    requireAuth,
    async (req, res, next) => {
        const userId = req.user.id;
        const { startDate, endDate } = req.body;
        const bookingId = req.params.bookingId;

        const booking = await Booking.findOne({ where: {id: bookingId}});

        if(!booking) {
           return res.status(404).json({message: "Booking couldn't be found"});
        }

        if (booking.startDate < startDate){
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

        const allBookings = await Booking.findAll();

        for (let booking of allBookings){
            const existingStartDate = booking.startDate;
            const existingEndDate = booking.endDate;

            if (startDate === existingStartDate || endDate === existingEndDate ){
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    errors: {
                        startDate: "Start date conflicts with an existing booking",
                        endDate: "End date conflicts with an existing booking"
                    }
                })
            }
        }

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
        const userId = req.user.id;
        const bookingId = req.params.bookingId;

        const booking = await Booking.findOne({where: {id: bookingId}});

        if (!booking) {
            return res.status(404).json({message: "Booking couldn't be found"});
        }

        const currentDate = new Date();

        if(booking.startDate < currentDate && currentDate < booking.endDate) {
            return res.status(403).json({
                message: "Bookings that have been started can't be deleted"
            })
        }

        if (userId === booking.userId){
            await booking.destroy();

            return res.status(200).json({message: "successfully deleted"});

        } else {
            return res.status(403).json({
                message: "Forbidden"
            })
        }
    }
);


module.exports = router;
