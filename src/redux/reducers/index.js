import { combineReducers } from 'redux'
import manifest from './manifest-reducers'
import auth from './auth-reducers'
import search from './search-reducers'
import snackbar from './snackbar-reducers'
import flow from './flow-reducers'
import mobile from './mobile-reducers'

export default combineReducers({
    manifest,
    auth,
    search,
    snackbar,
    flow,
    mobile
})