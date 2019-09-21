import { SET_SNACKBAR_MESSAGE, SET_SNACKBAR_VISIBLE } from '../constants'

export function setSnackbarMessage(message) {
    return {
        type: SET_SNACKBAR_MESSAGE,
        payload: message
    }
}

export function setSnackbarVisible(visible) {
    return {
        type: SET_SNACKBAR_VISIBLE,
        payload: visible
    }
}