import { SET_LOADING } from '../constants'

export function setLoading(loading) {
    return {
        type: SET_LOADING,
        payload: loading
    }
}