import React, { useEffect } from 'react'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, makeStyles, Button } from '@material-ui/core'
import { getS3Object, getManifest, getS3UploadURL } from '../../services/storage-service'
import { SaveAlt } from '@material-ui/icons'
import { connect } from 'react-redux'
import { setManifest, setSelectedItem, setPreviousKey, setCurrentKey } from '../../redux/actions/manifest-actions'
const useStyles = makeStyles({
    listStyle: {
        paddingLeft: '20%',
        paddingRight: '20%'
    }
})

const mapStateToProps = state => {
    return {
        manifest: state.manifest
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setManifest: (manifest) => dispatch(setManifest(manifest)),
        setSelectedItem: (item) => dispatch(setSelectedItem(item)),
        setPreviousKey: (key) => dispatch(setPreviousKey(key)),
        setCurrentKey: (key) => dispatch(setCurrentKey(key))
    }
}

function FileList(props) {
    const classes = useStyles()

    // useEffect(() => {
    //     getS3UploadURL(JSON.parse(localStorage.getItem("token")).id_token, "EXAMPLE_KEY_ACCESS_DENIED", 
    //         (data, success) => {

    //         })
    //     console.log(props.manifest)
    // }, [])

    const handleS3Response = (data, success) => {
        if(success) {
            props.setManifest(data)
        }
    }

    const handleS3DownloadResponse = (data, success) => {
        if(success){
            console.log('Successfully downloaded the object %O', data)
        }
    }
    const onFolderClick = (prefix) => {
        let token = JSON.parse(localStorage.getItem("token")).id_token
        getManifest(prefix, token, handleS3Response)
    }


    return (
        <div>
            <List
                className={classes.listStyle}>
                {props.manifest.files.map((item, i) => {
                return (
                        <ListItem
                            button
                            key={i}
                            onClick={() => { 
                                if(item.isFolder) { 
                                    props.setPreviousKey(props.manifest.currentKey)
                                    props.setCurrentKey(item.Key)
                                    onFolderClick(item.Key) 
                                }
                                else { props.setSelectedItem(item) }
                            }}>
                            <ListItemText>{item.Key}</ListItemText>
                            <ListItemSecondaryAction>
                                {item.isFolder == true?
                                (
                                    // <IconButton edge="end">
                                    //     <Folder/>
                                    // </IconButton>
                                    <span/>
                                ):(
                                    <IconButton 
                                        edge="end"
                                        onClick={() => {
                                            getS3Object(JSON.parse(localStorage.getItem("token")).id_token, item.Key, handleS3DownloadResponse)
                                        }}>
                                        <SaveAlt/>
                                    </IconButton>
                                )}
                            </ListItemSecondaryAction>
                        </ListItem>
                        )
                    }
                )}
            </List>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList)