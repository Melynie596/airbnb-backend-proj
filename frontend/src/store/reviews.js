import { csrfFetch } from "./csrf";

const GET_SPOT_REVIEWS = 'reviews/spotReviews';

const spotReviews = (reviews) => {
    return {
        type: GET_SPOT_REVIEWS,
        payload: reviews,
    }
};

export const getSpotReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const parsedRes = await res.json();

    if (res.ok) {
        dispatch(spotReviews(parsedRes));
        return res;
    }
}

const initialState = {};

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_SPOT_REVIEWS:
            newState = Object.assign({}, state);
            newState.reviews = action.payload;
            return newState;
        default:
            return state;
    }
};

export default reviewsReducer;
