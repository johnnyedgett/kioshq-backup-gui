import { SET_SNACKBAR_VISIBLE, SET_SNACKBAR_MESSAGE } from '../constants'

const initialState = {
    message: '',
    visible: false
}

export default function snackbar(state = initialState, action) {
    switch(action.type){
        case SET_SNACKBAR_VISIBLE:
            return Object.assign({}, state, {
                visible: action.payload
            })
        case SET_SNACKBAR_MESSAGE:
            return Object.assign({}, state, {
                message: action.payload
            })
        default:
            return state;
    }
}