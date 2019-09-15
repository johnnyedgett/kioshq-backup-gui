import { combineReducers } from 'redux'
import base from './base'
import manifest from './manifest-reducers'

export default combineReducers({
    base,
    manifest
})