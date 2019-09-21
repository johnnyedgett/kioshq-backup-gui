import { PUSH_KEY, POP_KEY, SET_ACTIVE_KEY } from '../constants'

const initialState = {
    history: [],
    activeKey: ''
}

export default function search(state = initialState, action) {
    let tmp
    switch(action.type){
        case PUSH_KEY:
            tmp = state.history
            tmp.push(action.payload)
            return Object.assign({}, state, {
                history: tmp,
                activeKey: action.payload
            })
        case POP_KEY:
            tmp = state.history
            tmp.pop()
            return Object.assign({}, state, {
                history: tmp,
                activeKey: tmp[tmp.length-1]
            })
        case SET_ACTIVE_KEY:
            return Object.assign({}, state, {
                activeKey: action.payload
            })
        default:
            return state;
    }
}