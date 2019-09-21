import { SET_LOADING } from '../constants'

const initialState = {
    loading: false
}

export default function flow(state = initialState, action) {
    switch(action.type){
        case SET_LOADING:
            return Object.assign({}, state, {
                loading: action.payload
            })
        default:
            return state;
    }
}