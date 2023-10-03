import { csrfFetch } from "./csrf";

//ACTION TYPES
const ALL_REVIEWS = "reviews/allReviews";
const REVIEW_DETAILS = "reviews/reviewDetails";
const DELET_REVIEWS = "reviews/deleteReview";
const CREATE_REVIEW = "reviews/newReview";

//ACTION CREATORS
const allReviews = (reviews) => ({
    type: ALL_REVIEWS,
    reviews
});

const reviewDetails = (review) => ({
    type: REVIEW_DETAILS,
    review
});

const newReview = (review) => ({
    type: CREATE_REVIEW,
    review
});

const deleteReview = () => ({
    type: DELET_REVIEWS,
});


//THUNK

export const fetchReviews = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}/reviews`);

    if(response.ok) {
        const data = await response.json();
        dispatch(allReviews(data.Reviews));
        return data;
     }
};

export const fetchReviewDetails = (reviewId) => async (dispatch) => {
    const response = csrfFetch(`/api/reviews/${reviewId}`);

    if(response.ok) {
        const data = (await response).json();
        dispatch(reviewDetails(data));
        return response;
    }
};

export const createReview = (spotId, reviewData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(reviewData),
    })

    if (response.ok) {
        const newRev = await response.json();
        dispatch(newReview(newRev));
        return newRev;
    }
};

export const removeReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
    });
    if(response.ok) {
        const data = await response.json();
        dispatch(deleteReview(reviewId));
        return data;
    }
};


const reviewsReducer = (state = {}, action) => {
    let newState = { ...state }
    switch (action.type) {
        case ALL_REVIEWS:
            newState[action.reviews[0].spotId] = [];
            action.reviews.forEach((review) => {
                newState[review.spotId].push(review);
            });
            return newState
        case REVIEW_DETAILS:
            newState[action.review.id] = action.review;
            return newState
        case CREATE_REVIEW:
            newState[action.review.id] = action.review;
            return newState
        case DELET_REVIEWS:
            newState = {};
            return newState
        default:
            return state;
    }
};

export default reviewsReducer;
