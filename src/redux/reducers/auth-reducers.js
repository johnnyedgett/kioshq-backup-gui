import { SET_AUTHENTICATED } from '../constants'

const initialState = {
    authenticated: false
}

export default function auth(state = initialState, action) {
    switch(action.type) {
        case SET_AUTHENTICATED:
            console.log("Authenticated? %O", action.payload)
            return Object.assign({}, state, {
                authenticated: action.payload
            })
        default:
            return state;
    }
}