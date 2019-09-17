import { PUSH_KEY, POP_KEY } from '../constants'

const initialState = {
    history: [],
}

export default function search(state = initialState, action) {
    let tmp
    switch(action.type){
        case PUSH_KEY:
            tmp = state.history
            tmp.push(action.payload)
            return Object.assign({}, state, {
                history: tmp
            })
        case POP_KEY:
            tmp = state.history
            tmp.pop()
            return Object.assign({}, state, {
                history: tmp
            })
        default:
            return state;
    }
}