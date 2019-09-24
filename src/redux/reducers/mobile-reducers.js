import { SET_MOBILE } from '../constants'

const initialState = {
    mobile: false
}

export default function mobile(state = initialState, action){
    switch(action.type){
        case SET_MOBILE:
            return Object.assign({}, state, {
                mobile: action.payload
            })
        default:
            return state
    }
}