import { PUSH_KEY, POP_KEY } from '../constants'

export function pushKey(key) {
    return {
        type: PUSH_KEY,
        payload: key
    }
}

export function popKey(key) {
    return {
        type: POP_KEY
    }
}