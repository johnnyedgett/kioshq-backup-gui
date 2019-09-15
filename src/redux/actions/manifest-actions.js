import { SET_MANIFEST, SET_SELECTED_ITEM, SET_CURRENT_KEY, SET_PREVIOUS_KEY } from '../constants'

export function setManifest(manifest) {
    console.log('Going to add manifest, %O', manifest)
    return {
        type: SET_MANIFEST,
        payload: manifest
    }
}

export function setSelectedItem(item) {
    return {
        type: SET_SELECTED_ITEM,
        payload: item
    }
}

export function setPreviousKey(key) {
    return {
        type: SET_PREVIOUS_KEY,
        payload: key
    }
}

export function setCurrentKey(key) {
    return {
        type: SET_CURRENT_KEY, 
        payload: key
    }
}