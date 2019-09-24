import { SET_MOBILE } from '../constants'

export const setMobile = (status) => {
    return {
        type: SET_MOBILE,
        payload: status
    }
}