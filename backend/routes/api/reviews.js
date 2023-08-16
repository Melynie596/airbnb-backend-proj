const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Review, Spot, ReviewImage, sequelize } = require('../../db/models');

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
    '/current',
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;

        const review = await Review.findAll({
            where: {userId: userId},
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ],
            group: ['Spot.id', 'Review.id', 'User.id', 'ReviewImages.id']

        });

        return res.status(200).json({Reviews: review});


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

        const review = await Review.findOne({
            where: { id: reviewId},
            include: {
                model: ReviewImage,
                attributes: ['url']
            }
        });

        console.log(review);

        if(!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
        }


        if (userId === review.userId) {

            const numImages = await ReviewImage.count({
                where : {reviewId: reviewId}
            });

            if(numImages > 10) {
                return res.status(403).json({
                    message: "Maximum number of images for this resource was reached"
                })
            } else {

                const addImage = await ReviewImage.create({
                    url,
                    reviewId: reviewId
                 });
                const response = {
                    id: addImage.id,
                    url: addImage.url
                }
                await addImage.save();

                return res.status(200).json(response);
            }
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
