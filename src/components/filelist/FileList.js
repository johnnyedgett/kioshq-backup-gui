import React, { useEffect, useState } from 'react'
import { IconButton, makeStyles, Table, TableHead, TableRow, TableBody, TableCell, Button, CircularProgress } from '@material-ui/core'
import { getS3Object, getManifest } from '../../services/storage-service'
import { SaveAlt, Folder } from '@material-ui/icons'
import { connect } from 'react-redux'
import { setManifest, setSelectedItem } from '../../redux/actions/manifest-actions'
import { pushKey, popKey } from '../../redux/actions/search-actions'

const useStyles = makeStyles({
    divStyle: {
        paddingLeft: '20%',
        paddingRight: '20%',
    },
    tableStyle: {
        border: '1px solid grey'
    },
    rowStyle: {
        '&:hover': {
            backgroundColor: '#efefef'
        }
    }
})

const mapStateToProps = state => {
    return {
        manifest: state.manifest,
        auth: state.auth,
        search: state.search
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setManifest: (manifest) => dispatch(setManifest(manifest)),
        setSelectedItem: (item) => dispatch(setSelectedItem(item)),
        pushKey: (key) => dispatch(pushKey(key)),
        popKey: () => dispatch(popKey())
    }
}

function FileList(props) {
    const classes = useStyles()
    const [newUser, setNewUser] = useState(false)

    useEffect(() => {
        // Root folder.
        if(props.search.history.length > 0) {
            getManifest(props.search.history[props.search.history.length-1], handleS3Response)
        }
        //eslint-disable-next-line
    }, [props.search])

    useEffect(() => {
        if(props.auth.authenticated === true) {
            if(localStorage.getItem("tokenType") == "idp" && localStorage.getItem("aws.cognito.identity-id.us-east-1:e710452b-401f-48d9-b673-1de1146855c1") != null) {
                let userKey = localStorage.getItem("aws.cognito.identity-id.us-east-1:e710452b-401f-48d9-b673-1de1146855c1")
                props.pushKey(userKey + "/")
            } else {
                setTimeout(() => {
                    console.log("Waiting three seconds after loggins in")
                    let userKey = localStorage.getItem("aws.cognito.identity-id.us-east-1:e710452b-401f-48d9-b673-1de1146855c1")
                    console.log("looking for: %O/", userKey)
                    props.pushKey(userKey + "/")
                }, 3000)
            }
        }
        //eslint-disable-next-line
    }, [props.auth])

    useEffect(() => {
        // Any time reload changes, get the manifest again.
        if(!props.firstRun) {
            getManifest(props.search.history[props.search.history.length-1], handleS3Response)        
        }
    }, [props.reload])

    useEffect(() => {
        // Call the method here to create the new user resourceas with a callback to this accountonce it has completed
        console.log("Let's create the resources for the new user ")
    }, [props.newUser])

    const handleS3Response = (data, success, isNewUser)  => {
        if(success && !isNewUser) {
            props.setManifest(data)
            props.setFirstRun(false)
        } else if(success && isNewUser) {
            props.setNewUser(true)
            props.setFirstRun(false)
        }
    }

    const handleS3DownloadResponse = (data, success) => {
        if(success){
            console.log('Successfully downloaded the object %O', data)
        }
    }

    return (
        <div
            className={classes.divStyle}>
            {props.newUser?
                <div>
                    Welcome to Kios! Please wait while we finish setting up your account. No need to go anywhere - this will update automagically!
                    <br/>
                    <br/>
                    <CircularProgress/>
                </div>:
                <Table
                    className={classes.tableStyle}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: '3vw'}}>Icon</TableCell>
                        <TableCell style={{ width: '10vw'}}>File</TableCell>
                        <TableCell style={{ width: '3vw'}}>Size</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.manifest.files.map((item, i) => {
                        let regex = /(.{1})\/(.*)/
                        let matched = item.Key.match(regex)
                        return (
                            i===0?(<TableRow key={i}/>):
                            (<TableRow 
                                key={i} 
                                className={classes.rowStyle}
                                onClick={() => { 
                                    if(item.isFolder) { 
                                        props.pushKey(item.Key)
                                    }
                                    else { 
                                        props.setSelectedItem(item)
                                    }
                                }}
                                >
                                <TableCell>
                                    {!item.isFolder?(<IconButton 
                                        edge="end"
                                        onClick={() => {
                                            console.log("You clicked the ICON button: LETS GET THAT OBJECT!")
                                            if(localStorage.getItem("tokenType") === "custom")
                                                getS3Object(item.Key, handleS3DownloadResponse)
                                            else 
                                                getS3Object(item.Key, handleS3DownloadResponse)
                                        }}>
                                        <SaveAlt/>
                                    </IconButton>):(
                                        <IconButton
                                            onClick={() => {
                                                // props.setPreviousKey(props.manifest.currentKey)
                                                // props.setCurrentKey(item.Key)
                                                props.pushKey(item.Key)
                                            }}>
                                            <Folder/>
                                        </IconButton>
                                    )}
                                </TableCell>
                                <TableCell>{matched[2]}</TableCell>
                                <TableCell>1234 KB {item.isFolder?('(NESTED)'):('')}</TableCell>
                            </TableRow>
                        ))
                    })}
                </TableBody>
            </Table>
            }
            
            <br/>
            {props.search.history.length > 1?(<Button onClick={() => props.popKey()} variant="contained" color="primary">Up One Folder</Button>)
                :(<Button variant="contained" disabled>Return</Button>)}
        </div>
    )
//     return (
//         <div>
//             <List
//                 className={classes.listStyle}>
//                 {props.manifest.files.map((item, i) => {
//                 return (
//                         <ListItem
//                             button
//                             key={i}
//                             onClick={() => { 
//                                 if(item.isFolder) { 
//                                     props.setPreviousKey(props.manifest.currentKey)
//                                     props.setCurrentKey(item.Key)
//                                     onFolderClick(item.Key) 
//                                 }
//                                 else { props.setSelectedItem(item) }
//                             }}>
//                             <ListItemText>{item.Key}</ListItemText>
//                             <ListItemSecondaryAction>
//                                 {item.isFolder == true?
//                                 (
//                                     // <IconButton edge="end">
//                                     //     <Folder/>
//                                     // </IconButton>
//                                     <span/>
//                                 ):(
//                                     <IconButton 
//                                         edge="end"
//                                         onClick={() => {
//                                             getS3Object(JSON.parse(localStorage.getItem("token")).id_token, item.Key, handleS3DownloadResponse)
//                                         }}>
//                                         <SaveAlt/>
//                                     </IconButton>
//                                 )}
//                             </ListItemSecondaryAction>
//                         </ListItem>
//                         )
//                     }
//                 )}
//             </List>
//         </div>
//     )
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList)