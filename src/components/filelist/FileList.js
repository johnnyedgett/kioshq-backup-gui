import React, { useEffect } from 'react'
import { IconButton, makeStyles, Table, TableHead, TableRow, TableBody, TableCell, Button } from '@material-ui/core'
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

    useEffect(() => {
        // Root folder.
        if(props.search.history.length > 0) {
            getManifest(props.search.history[props.search.history.length-1], handleS3Response)
        } 
        //eslint-disable-next-line
    }, [props.search])

    useEffect(() => {
        if(props.auth.authenticated === true) {
            let userKey = localStorage.getItem("aws.cognito.identity-id.us-east-1:e710452b-401f-48d9-b673-1de1146855c1")
            props.pushKey(userKey + "/")
        }
        //eslint-disable-next-line
    }, [props.auth])

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

    return (
        <div
            className={classes.divStyle}>
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
                                            getS3Object(JSON.parse(localStorage.getItem("token")).id_token, item.Key, handleS3DownloadResponse)
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