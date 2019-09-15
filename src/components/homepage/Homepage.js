import React, { useEffect, useState } from 'react'
import qs from 'query-string'
import { getUserToken, validateToken } from '../../services/auth-service.js'
import { loadInitialManifest } from '../../services/storage-service.js'
import { setManifest, setPreviousKey, setCurrentKey } from '../../redux/actions/manifest-actions'
import history from '../../util/history'
import FileList from '../filelist/FileList'
import { connect } from 'react-redux'
import DetailsDrawer from '../detailsdrawer/DetailsDrawer'

const mapStateToProps = state => {
    return {
        manifest: state.manifest
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setFiles: (files) => dispatch(setManifest(files)),
        setPreviousKey: (key) => dispatch(setPreviousKey(key)),
        setCurrentKey: (key) => dispatch(setCurrentKey(key))
    }
}

function Homepage(props){
    useEffect(() => {
        if(!localStorage.getItem("token")) initialize()
        else {
            validateToken(localStorage.getItem("token"), (success) => {
                if(success) {
                    // good token
                    loadInitialManifest(JSON.parse(localStorage.getItem("token")).id_token, handleManifestResponse)
                } else initialize()
            })
        }
        //eslint-disable-next-line
    }, [props.location.search])

    const initialize = () => {
        let query = qs.parse(props.location.search)

        if(!query.code){
            history.push("/redirect?url=https://www.kioshq.com")
        } else {
            getUserToken(query.code, (token, success) => {
                if(success) { 
                    loadInitialManifest(token, handleManifestResponse)
                } else history.push("/redirect?url=https://www.kioshq.com")            
            })
        }
    }

    const handleManifestResponse = (files, success, key) => {
        if(success) {
            props.setFiles(files)
            props.setPreviousKey(key)
        } else {
            console.error('There was an error retrieving the data')
        }   
    }



    return (
        <div align="center">
            <h1>Greetings, user. Here are your files.</h1>
                <FileList/>
            <DetailsDrawer/>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)