import { SET_MANIFEST } from '../constants'

const initialState = {
    manifest: []
}

export default function manifest(state = initialState, action) {
    switch(action.type) {
        case SET_MANIFEST:
            return Object.assign({}, state, {
                manifest: action.payload
            })
        default:
            return state;
    }
}