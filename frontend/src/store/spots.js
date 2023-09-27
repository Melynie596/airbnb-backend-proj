import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = 'spots/getAllSpots';
const SPOT_DETAILS = 'spots/spotDetails';
const CREATE_SPOT = 'spots/createSpot';
const ADD_SPOT_IMAGE = 'spots/addSpotImage';
const DELETE_SPOT = 'spots/deleteSpot';
const USER_SPOTS = 'spots/userSpots';
const UPDATE_SPOT = 'spots/update';


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

const spotImage = (spotId, image) => {
    return {
        type: ADD_SPOT_IMAGE,
        spotId,
        image
    }
}

const deleteSpot = (spot) => {
    return {
        type: DELETE_SPOT,
        payload: spot
    }
}

const userSpots = (spots) => {
    return {
        type: USER_SPOTS,
        payload: spots
    }
};

const update = (spotId, spot) => {
    return {
        type: UPDATE_SPOT,
        spotId,
        spot,
    }
}


export const getSpots = () => async(dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: "GET"
    });
    const parsedRes = await res.json();

    if (res.ok) {
        dispatch(getAllSpots(parsedRes))
        return res;
    }
}

export const getSpotDetails = (spotId) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    const parsedRes = await res.json();

    if (res.ok) {
        dispatch(spotDetails(parsedRes));
        return res;
    }
}

export const createASpot = (spot) => async(dispatch) => {

    const { country, address, city, state, name, description, price, lat, lng} = spot;
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            name,
            description,
            price,
            lat,
            lng
    })
    })

    const parsedRes = await res.json();

    if (res.ok) {
        dispatch(createSpot(parsedRes));
        return res;
    }
};

export const addSpotImage = (spotId, {imageUrl, preview}) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            imageUrl,
            preview
        })
    });
    const parsedRes = await res.json();

    if (res.ok) {
        return dispatch(spotImage(spotId, parsedRes));
    }
};

export const removeSpot = (spotId) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    });
    const parsedRes = await res.json();

    if (res.ok) {
        dispatch(deleteSpot(parsedRes));
    }
    else {
        throw new Error("Spot deletion failed")
    }
};

export const getUserSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current');
    const parsedRes = await res.json();

    if (res.ok) {
        dispatch(userSpots(parsedRes));
        return res;
    }
}

export const updateSpot = (spotId, spotData) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        body: JSON.stringify(spotData),
    });

    const parsedRes = await res.json();

    if (res.ok) {
        dispatch(update(spotId, parsedRes))
        return res;
    }
}


const initialState = {};

const spotsReducer = (state = initialState, action) => {
    let newState = { ...state }
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
            return newState;
        case ADD_SPOT_IMAGE:
            newState = Object.assign({}, state);
            newState.image = action.payload;
            return newState
        case USER_SPOTS:
            newState = Object.assign({}, state);
            newState.spots = action.payload;
            return newState;
        case DELETE_SPOT:
            delete newState[action.spotId]
            return newState;
        case UPDATE_SPOT:
            newState[action.spot.id] = action.spot;
            return newState
        default:
        return state;
    }
};

export default spotsReducer;
