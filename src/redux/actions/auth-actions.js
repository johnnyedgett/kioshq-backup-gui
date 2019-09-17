import { SET_AUTHENTICATED } from '../constants'

export function setAuthenticated(status) {
    return {
        type: SET_AUTHENTICATED,
        payload: status
    }
}
