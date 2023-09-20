import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = 'spots/getAllSpots';

const getAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    };
};

export const getSpots = () => async(dispatch) => {
    console.log('we are here');
    const res = await csrfFetch('/api/spots', {
        method: "GET"
    });
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
            newState.spots = action.payload;
             console.log(newState);
            return newState;
        default:
        return state;
    }
};

export default spotsReducer;
