import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = 'spots/getAllSpots';
const SPOT_DETAILS = 'spots/spotDetails';
const CREATE_SPOT = 'spots/createSpot';
const ADD_SPOT_IMAGE = 'spots/addSpotImage';

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

const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        payload: spot
    }
};

const spotImage = (image) => {
    return {
        type: ADD_SPOT_IMAGE,
        payload: image
    }
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

export const createASpot = (spot) => async(dispatch) => {
    const { country, address, city, state, name, description, price, lat, lng} = spot;
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            address,
            city,
            state,
            country,
            name,
            description,
            price
        )
    })
    const parsedRes = await res.json();

    if (res.ok) {
        dispatch(createSpot(parsedRes));
    }
};

export const addSpotImage = (spotId, imageUrl) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            imageUrl
        }
    });

    const parsedRes = await res.json();

    if (res.ok) {
        dispatch(spotImage(parsedRes));
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
        case CREATE_SPOT:
            newState = Object.assign({}, state);
            newState.spot = action.payload;
        case ADD_SPOT_IMAGE:
            newState = Object.assign({}, state);
            newState.image = action.payload;
        default:
        return state;
    }
};

export default spotsReducer;
