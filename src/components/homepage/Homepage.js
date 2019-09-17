import React, { useEffect, useState } from 'react'
import qs from 'query-string'
import { getUserToken, validateToken } from '../../services/auth-service.js'
import { setManifest, setPreviousKey, setCurrentKey } from '../../redux/actions/manifest-actions'
import { pushKey, popKey } from '../../redux/actions/search-actions'
import { setAuthenticated } from '../../redux/actions/auth-actions'
import history from '../../util/history'
import FileList from '../filelist/FileList'
import { connect } from 'react-redux'
import DetailsDrawer from '../detailsdrawer/DetailsDrawer'
import FileDropzone from '../filedropzone/FileDropzone'

const mapStateToProps = state => {
    return {
        manifest: state.manifest,
        search: state.search
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setFiles: (files) => dispatch(setManifest(files)),
        setPreviousKey: (key) => dispatch(setPreviousKey(key)),
        setCurrentKey: (key) => dispatch(setCurrentKey(key)),
        setAuthenticated: (status) => dispatch(setAuthenticated(status)),
        pushKey: (key) => dispatch(pushKey(key)),
        popKey: () => dispatch(popKey())
    }
}

function Homepage(props){
    const [showFilezone, setShowFilezone] = useState(false)

    useEffect(() => {
        let query = qs.parse(props.location.search)

        validateToken((success) => {
            if(success) {
                props.setAuthenticated(true)
            } else if(query.code) {
                getUserToken(query.code, (success) => {
                    if(success) { 
                        props.setAuthenticated(true)
                    } else {
                        props.setAuthenticated(false)
                        history.push("/redirect?url=https://www.kioshq.com") 
                    }           
                })
            } else if(!query.code) {
                props.setAuthenticated(false)
                history.push("/redirect?url=https://www.kioshq.com") 
            }
        })
        //eslint-disable-next-line
    }, [])

    return (
        <div align="center" onDragOverCapture={() => setShowFilezone(true)} onDragExit={() => setShowFilezone(false)}>
            {showFilezone?<FileDropzone/>:<span/>}
            <h1>Greetings, user. Here are your files.</h1>
                <FileList/>
            <DetailsDrawer/>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)