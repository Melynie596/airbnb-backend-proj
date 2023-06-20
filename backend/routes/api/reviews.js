const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Review, Spot } = require('../../db/models');
const ReviewImage = require('../../db/models/reviewimage');

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateReview = [
    check('review')
    .exists({ checkFalsy: true })
    .notEmpty()
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
]

// get all reviews of the current user
router.get(
    '/:userId',
    requireAuth,
    async (req, res) => {
        const userId = req.params.userId;

        const review = await Review.findAll({
            where: {userId: userId},
            include: [
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage' ]
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                },
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastname']
                }
            ],
            group: ['Spot.id', 'Review.id', 'User.id', 'ReviewImages.id']

        });

        return res.status(200).json(review);
    }
);

// get all reviews by a spot id

router.get(
    '/:spotId',
    async(req, res, next) => {
        const spotId = req.params.spotId;

        const reviews = await Review.findAll({
            where: { spotId: spotId},
            include: [
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        if(!reviews) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        return res.status(200).json(reviews)
    }
)


//create a review for a spot based on the spots id

router.post(
    '/:spotId',
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

        const existingReview = await Review.findOne({where: {userId: userId}});

        if (existingReview) {
          return res.status(500).json({
            message: "User already has a review for this spot"
          })
        }

            const newReview = await Review.create({
                userId: userId,
                spotId: spotId,
                review,
                stars
            });

            return res.status(201).json(newReview);



    }
);

// add an image to a review based on the review's id

router.post(
    '/:reviewId/images',
    requireAuth,
    async(req, res, next) => {
        const url = req.body;
        const reviewId = req.params.reviewId;

        const review = await Review.findOne({ where: { id: reviewId}});

        if(!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
        }

        const reviewImages = await reviewImage.findOne({where : {reviewId: reviewId}});


        if(reviewImages.url.length === 10) {
            return res.status(403).json({
                message: "Maximum number of images for this resource was reached"
            })
        }

        const addImage = await reviewImage.create({ url });

        return res.status(200).json(addImage);
    }
);

//edit a review

router.put(
    '/:reviewId',
    requireAuth,
    validateReview,
    async(req, res, next) => {
        const { review, stars } = req.body;
        const reviewId = req.params.reviewId;

        const editReview = await Review.findOne({ where: {id: reviewId}});

        if(!editReview) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
        }

        editReview.set({
            review: review,
            stars: stars
        });

        editReview.save();

        return res.status(200).json(editReview);
    }
);

//delete a review

router.delete(
    '/:reviewId',
    requireAuth,
    async (req, res, next) => {
        const reviewId = req.params.reviewId;

        const review = await Review.findOne({ where: {id: reviewId} });

        if (!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
        }
        await review.destroy();


        return res.status(200).json({message: "successfully deleted"});
    }
);

//delete a review image
router.delete(
    '/:reviewId/images/:imageId',
    requireAuth,
    async (req, res, next) => {
        const reviewId = req.params.reviewId;
        const imageId = req.params.imageId;

        const reviewImage = await ReviewImage.findOne({
            where: {
                id: imageId,
                reviewId: reviewId
            }
        });

        if (!reviewImage) {
            return res.status(404).json({
                message: "Review Image couldn't be found"
            })
        }

        reviewImage.destroy();

        return res.status(200).json({message: "successfully deleted"});
    }
);



module.exports = router;
