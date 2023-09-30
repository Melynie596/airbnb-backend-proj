import { csrfFetch } from './csrf';

// Action Types
const GET_REVIEWS = 'reviews/getReviews';
const POST_REVIEWS = 'reviews/postReviews';
const DELETE_REVIEW = 'reviews/deleteReview';
const REVIEW_DETAILS = 'reviews/reviewDetails';


// Action Creators
const getReviewsAction = (reviews) => {
    return {
        type: GET_REVIEWS,
        payload: reviews
    }
}


const postReviewAction = (review) => ({
  type: POST_REVIEWS,
  review,
});

const deleteReviewAction = () => ({
  type: DELETE_REVIEW,
});

const reviewDetails = (review) => {
    return {
        type: REVIEW_DETAILS,
        payload: review,
    }
}



// Thunks
export const fetchReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  const parsedRes = await res.json();

  if (res.ok) {
      dispatch(getReviewsAction(parsedRes.Reviews));
      return res;
  }
};

export const createReview = (spotId, reviewData) => async (dispatch) => {
  const res = await csrfFetch(`api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(reviewData),
  })

  const parsedRes = await res.json();

  if (res.ok) {
    dispatch(postReviewAction(parsedRes));
    return parsedRes;
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
 const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE"
 })

 const parsedRes = await res.json();

 if (res.ok) {
    dispatch(deleteReviewAction(reviewId));
    return parsedRes;
 }

};

export const fetchReviewDetails = (reviewId) => async (dispatch) => {
    const res = csrfFetch(`api/reviews/${reviewId}`);

    const parsedRes = (await res).json();

    if (res.ok) {
        dispatch(reviewDetails(parsedRes));
        return res;
    }
}

// Reviews Reducer
const reviewsReducer = (state = {}, action) => {
  let newState = {...state};
  switch (action.type) {
    case GET_REVIEWS:
        newState[action.payload[0].spotId] = [];
        action.payload.forEach((review) => {
            newState[review.spotId].push(review);
        })
        return newState;
    case REVIEW_DETAILS:
        newState[action.review.id] = action.review;
        return newState;
    case POST_REVIEWS:
      newState[action.review.id] = action.review;
      return newState;
    case DELETE_REVIEW:
      delete newState[action.reviewId];
      return newState;

    default:
      return state;
  }
};

export default reviewsReducer;
