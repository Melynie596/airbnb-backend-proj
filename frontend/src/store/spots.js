import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = 'spots/getAllSpots';

const getAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    };
};

export const getSpots = () => async(dispatch) => {
    const res = await csrfFetch('/api/spots');
    const parsedRes = await res.json();

    if (res.ok) {
        dispatch(getAllSpots(parsedRes))
    }
}


const initialState = {};

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_SPOTS:
            newState = Object.assign({}, state);
            newState.spot = action.payload;
            return newState;
        default:
        return state;
    }
};

export default spotsReducer;
