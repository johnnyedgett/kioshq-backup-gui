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
import { Button } from '@material-ui/core';

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
            console.log("Validate token done.")
            if(success) {
                console.log("Validate token done and user is logged in.")

                props.setAuthenticated(true)
            } else if(query.code) {
                console.log("Validate token done and user is NOT logged in. Checking their query code")

                getUserToken(query.code, (success) => {
                    if(success) { 
                        console.log("Good query code. User is logged in")
                        props.setAuthenticated(true)
                    } else {
                        console.log("BAD query code. User is NOT logged in")

                        props.setAuthenticated(false)
                        history.push("/login")
                    }           
                })
            } else if(!query.code) {
                console.log("No query code. User is not logged in")
                props.setAuthenticated(false)
                history.push("/login")
            }
        })
        //eslint-disable-next-line
    }, [])

    return (
        <div align="center" onDragOverCapture={() => setShowFilezone(true)}>
            {showFilezone?<FileDropzone/>:<span/>}
            <h1>Greetings, user. Here are your files.</h1>
            <Button variant="outlined" color="primary" onClick={() => setShowFilezone(true)}>Upload Files</Button>
                <br/><br/><br/>
                <FileList/>
            <DetailsDrawer/>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)