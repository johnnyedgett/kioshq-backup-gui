import React, { useEffect, useState } from 'react'
import qs from 'query-string'
import { getUserToken, validateToken } from '../../services/auth-service.js'
import { loadInitialManifest } from '../../services/storage-service.js'
import history from '../../util/history'
import FileList from '../filelist/FileList'

export default function Homepage(props){
    const [devItems, setDevItems] = useState([])

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

    const handleManifestResponse = (manifest, success) => {
        if(success) {
            console.log('Received data: %O', manifest)
            console.log(manifest.Contents)
            setDevItems(manifest.Contents)
        } else {
            console.error('Shit')
        }   
    }



    return (
        <div align="center">
            <h1>Greetings, user. Here are your files.</h1>
                <FileList
                    files={devItems}/>
            
        </div>
    )
}