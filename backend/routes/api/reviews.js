const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Review, Spot, ReviewImage } = require('../../db/models');

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
]

// get all reviews of the current user
router.get(
    '/users',
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;

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
                    attributes: ['id', 'firstName', 'lastName']
                }
            ],
            group: ['Spot.id', 'Review.id', 'User.id', 'ReviewImages.id']

        });

        return res.status(200).json(review);


    }
);

// error responses, errors codes, match api docs, edit a spot create, signup (first last name), error bodys to match the docs,

// get all reviews by a spot id

router.get(
    '/:spotId',
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

            return res.status(201).json(newReview);



    }
);

// add an image to a review based on the review's id

router.post(
    '/:reviewId/images',
    requireAuth,
    async(req, res, next) => {
        const url = req.body.url;
        const userId = req.user.id;
        const reviewId = req.params.reviewId;

        const review = await Review.findOne({ where: { id: reviewId}});

        if(!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
        }


        if (userId === review.userId) {
            const addImage = await ReviewImage.create({ url });
            const response = {
                id: addImage.id,
                url: addImage.url
            }

            await addImage.save();

            const reviewImages = await ReviewImage.findAll({where : {reviewId: reviewId}});

            if(reviewImages.length === 10) {
                return res.status(403).json({
                    message: "Maximum number of images for this resource was reached"
                })
            }

            console.log(reviewImages);

            return res.status(200).json(response);
        } else {
            return res.status(403).json({message: "Forbidden"});
        }


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
        const userId = req.user.id;

        const editReview = await Review.findOne({ where: {id: reviewId}});

        if(!editReview) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
        }

        if (userId === editReview.userId){
            await editReview.set({
                review: review,
                stars: stars
            });

           await editReview.save();

            return res.status(200).json(editReview);
        } else {
            return res.status(403).json({message: "Forbidden"});
        }

    }
);

//delete a review

router.delete(
    '/:reviewId',
    requireAuth,
    async (req, res, next) => {
        const reviewId = req.params.reviewId;
        const userId = req.user.id;

        const review = await Review.findOne({ where: {id: reviewId} });

        if (!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
        }

        if (userId === review.userId){
            await review.destroy();

            return res.status(200).json({message: "successfully deleted"});
        } else {
            return res.status(403).json({message: "Forbidden"})
        }


    }
);

//delete a review image
router.delete(
    '/:reviewId/images/:imageId',
    requireAuth,
    async (req, res, next) => {
        const reviewId = req.params.reviewId;
        const imageId = req.params.imageId;
        const userId = req.user.id;

        const reviewImages = await ReviewImage.findOne({
            where: {
                id: imageId,
                reviewId: reviewId
            }
        });

        if (!reviewImages) {
            return res.status(404).json({
                message: "Review Image couldn't be found"
            })
        }
        const review = await Review.findOne({ where: { id: reviewId}});

        if (userId === review.userId){
            await reviewImages.destroy();

            return res.status(200).json({message: "successfully deleted"});
        } else {
            return res.status(403).json({message: "Forbidden"});
        }


    }
);



module.exports = router;
