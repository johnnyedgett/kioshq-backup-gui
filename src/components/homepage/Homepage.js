import React, { useEffect, useState } from 'react'
import { setManifest, setPreviousKey, setCurrentKey } from '../../redux/actions/manifest-actions'
import { pushKey, popKey, setActiveKey } from '../../redux/actions/search-actions'
import { setLoading } from '../../redux/actions/flow-actions'
import { setAuthenticated } from '../../redux/actions/auth-actions'
import FileList from '../filelist/FileList'
import { connect } from 'react-redux'
import DetailsDrawer from '../detailsdrawer/DetailsDrawer'
import FileDropzone from '../filedropzone/FileDropzone'
import { IconButton, Button, Snackbar } from '@material-ui/core';
import { createFolder, createUserFolder } from '../../services/storage-service.js';
import { getManifest } from '../../services/storage-service'
import { setSnackbarMessage, setSnackbarVisible } from '../../redux/actions/snackbar-actions'
import isEmpty from 'lodash.isempty'
import PromptBox from '../promptbox/PromptBox';

const prefixSource = "aws.cognito.identity-id.us-east-1:e710452b-401f-48d9-b673-1de1146855c1"

const mapStateToProps = state => {
    return {
        manifest: state.manifest,
        search: state.search,
        snackbar: state.snackbar
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setFiles: (files) => dispatch(setManifest(files)),
        setPreviousKey: (key) => dispatch(setPreviousKey(key)),
        setCurrentKey: (key) => dispatch(setCurrentKey(key)),
        setActiveKey: (key) => dispatch(setActiveKey(key)),
        setAuthenticated: (status) => dispatch(setAuthenticated(status)),
        pushKey: (key) => dispatch(pushKey(key)),
        popKey: () => dispatch(popKey()),
        setSnackbarMessage: (message) => dispatch(setSnackbarMessage(message)),
        setSnackbarVisible: (visible) => dispatch(setSnackbarVisible(visible)),
        setLoading: (loading) => dispatch(setLoading(loading))
    }
}

function Homepage(props){
    // const classes =
    const [firstRun, setFirstRun] = useState(true)
    const [showFilezone, setShowFilezone] = useState(false)
    const [reload, setReload] = useState(false)
    const [newUser, setNewUser] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [createFolderOpen, setCreateFolderOpen] = useState(false)

    useEffect(()=> {
        if(newUser)
            createUserFolder(handleUserFolderResponse)
    }, [newUser])

    useEffect(() => {
        console.log("First Run: %O, New User: %O", firstRun, newUser)

        if(firstRun === false && newUser === false)
            setButtonDisabled(false)

    }, [newUser, firstRun])

    useEffect(() => {
        console.log("Ran the initial mounting method")

        let prefix = localStorage.getItem(prefixSource)
        prefix = prefix+"/"
        getManifest(prefix, (files, success, isNewUser) => {
            if(success) { 
                if(isNewUser) {
                    setFirstRun(false)
                    setNewUser(true)
                } 
                else {
                    console.log('files for the new user: %O', files)
                    props.setFiles(files)
                    if(files.length > 0)
                        props.pushKey(files[0].Key)
                    setFirstRun(false)
                }
            } else {
                // TODO: ERROR HANDLING
            }
        })
    }, [])

    useEffect(() => {
        if(!isEmpty(props.search.activeKey) && !firstRun) {
            getManifest(props.search.activeKey, (files, success, isNewUser) => {
                if(success) {
                    props.setFiles(files)
                }
            })
        } else if (isEmpty(props.search.activeKey) && !firstRun && newUser) { // this is a new user
            console.log("NICE ")
            let prefix = localStorage.getItem(prefixSource)
            prefix = prefix+"/"
            getManifest(prefix, (files, success, isNewUser) => {
                if(success) {
                    props.setFiles(files)
                    props.pushKey(files[0].Key)
                    setNewUser(false)
                }
            })
        }
    }, [props.search, reload])

    const triggerReload = () => {
        setReload(!reload)
    }

    const handleUserFolderResponse = (data, success) => {
        if(success) {
            setReload(!reload)
        }
    }

    const handleCreateFolder = (data, success) => {
        if(success) {
            console.log(data)
            setReload(!reload)
        }
    }

    return (
        <div align="center" onDragOverCapture={() => setShowFilezone(true)}>
            {showFilezone?
            <div style={{ 
                paddingLeft: '20vw', 
                paddingRight: '20vw'
                }}>
                    <FileDropzone 
                        triggerReload={triggerReload}/>
            </div>:<span/>}
            <h1>Greetings, user. Here are your files.</h1>
            <Button variant="contained" color="primary" onClick={() => setShowFilezone(true)} disabled={buttonDisabled}>Upload Files</Button> &nbsp;
            <Button 
                variant="contained"
                color="primary"
                onClick={() => setCreateFolderOpen(true)}
                // onClick={() => createFolder(props.search.activeKey + "test/", handleCreateFolder)}
                disabled={buttonDisabled}>
                    Create Folder
            </Button>
            <br/><br/><br/>
            <FileList
                reload={reload}
                firstRun={firstRun}
                newUser={newUser}/>
            <DetailsDrawer/>
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={props.snackbar.visible}
                autoHideDuration={3000}
                onClose={() => {
                    props.setSnackbarVisible(false)
                    props.setSnackbarMessage('')
                }}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{props.snackbar.message}</span>}
                action={[
                    <IconButton
                      key="close"
                      aria-label="close"
                      color="inherit"
                      onClick={() => {
                        props.setSnackbarVisible(false)
                        props.setSnackbarMessage('')
                      }}
                    >

                      {/* <CloseIcon /> */}
                    </IconButton>
                  ]}/>
                <PromptBox
                    open={createFolderOpen}
                    onClose={() => setCreateFolderOpen(false)}
                    submitValue={(input) => createFolder(props.search.activeKey + input + "/", handleCreateFolder)}
                    prompt={{
                        "title": "Input folder name"
                    }}
                    />
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)