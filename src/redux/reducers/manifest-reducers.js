import { SET_MANIFEST, SET_SELECTED_ITEM, SET_CURRENT_KEY, SET_PREVIOUS_KEY} from '../constants'

const initialState = {
    files: [],
    selectedItem: {},
    previousKey: "",
    currentKey: "",
    uploadUrl: ""
}

export default function manifest(state = initialState, action) {
    let tmp
    switch(action.type) {
        case SET_MANIFEST:
            // Pre-processing: check if the file is a folder or not
            tmp = Object.assign([], action.payload)
            tmp.map((item) => {
                const regex = /(.*)\/(.*)/
                const matched = item.Key.match(regex)
                item.isFolder = matched[matched.length-1] === ''?true:false
                return item
            })
            return Object.assign({}, state, {
                files: tmp
            })
        case SET_SELECTED_ITEM:
            console.log(action.payload)
            return Object.assign({}, state, {
                selectedItem: action.payload
            })
        case SET_PREVIOUS_KEY:
            return Object.assign({}, state, {
                previousKey: action.payload
            })
        case SET_CURRENT_KEY: 
            return Object.assign({}, state, {
                currentKey: action.payload
            })
        default:
            return state;
    }
}