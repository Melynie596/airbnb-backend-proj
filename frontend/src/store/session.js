import { csrfFetch } from "./csrf";

export const SET_SESSION_USER = "session/SET_SESSION_USER";
export const REMOVE_SESSION_USER = "session/REMOVE_SESSION_USER";

export const setSessionUser = (user) => ({
    type: SET_SESSION_USER,
    payload: user
});

export const removeSessionUser = () => ({
    type: REMOVE_SESSION_USER
});

export const loginSessionUser = (user) => async(dispatch) => {
    const { credential, password } = user;
    const res = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({
            credential,
            password,
        }),
    });
    const parsedRes = await res.json();

    if(res.ok) {
       return dispatch(setSessionUser(parsedRes));
    }
}

const initalState = {
    user: null
}


const sessionReducer = (state = initalState, action) => {
    let newState;
    switch (action.type) {
        case SET_SESSION_USER:
            newState = Object.assign({}, state);
            newState.user = action.payload;
            return newState;
        case REMOVE_SESSION_USER:
            newState = Object.assign({}, state);
            newState.user = null;
        default:
            return state;
    }
}

export default sessionReducer;
