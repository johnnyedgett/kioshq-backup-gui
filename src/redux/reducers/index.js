import { combineReducers } from 'redux'
import base from './base'
import manifest from './manifest-reducers'
import auth from './auth-reducers'
import search from './search-reducers'

export default combineReducers({
    base,
    manifest,
    auth,
    search
})