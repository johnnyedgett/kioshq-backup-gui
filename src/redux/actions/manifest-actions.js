import { SET_MANIFEST } from '../constants'

export function setManifest(manifest) {
    console.log('Going to add manifest, %O', manifest)
    return {
        type: SET_MANIFEST,
        payload: manifest
    }
}