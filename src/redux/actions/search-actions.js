import { PUSH_KEY, POP_KEY, SET_LOADING, SET_ACTIVE_KEY } from '../constants'

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

export function setActiveKey(key) {
    return { 
        type: SET_ACTIVE_KEY, 
        payload: key
    }
}

export function setLoading(loading) {
    return {
        type: SET_LOADING,
        payload: loading
    }
}