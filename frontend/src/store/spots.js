import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = 'spots/getAllSpots';
const SPOT_DETAILS = 'spots/spotDetails';

const getAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    };
};

const spotDetails = (detail) => {
    return {
        type: SPOT_DETAILS,
        payload: detail
    };
}


export const getSpots = () => async(dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: "GET"
    });
    const parsedRes = await res.json();

    if (res.ok) {
        dispatch(getAllSpots(parsedRes))
    }
}

export const getSpotDetails = (spotId) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    const parsedRes = await res.json();

    if (res.ok) {
        dispatch(spotDetails(parsedRes));
    }
}


const initialState = {};

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_SPOTS:
            newState = Object.assign({}, state);
            newState.spots = action.payload;
            return newState;
        case SPOT_DETAILS:
            newState = Object.assign({}, state);
            newState.spot = action.payload;
            return newState;
        default:
        return state;
    }
};

export default spotsReducer;
