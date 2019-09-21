import React, { useEffect, useState } from 'react'
import { IconButton, makeStyles, Table, TableHead, TableRow, TableBody, TableCell, Button, CircularProgress } from '@material-ui/core'
import { getS3Object, getManifest } from '../../services/storage-service'
import { SaveAlt, Folder } from '@material-ui/icons'
import { connect } from 'react-redux'
import { setManifest, setSelectedItem } from '../../redux/actions/manifest-actions'
import { pushKey, popKey } from '../../redux/actions/search-actions'
import isEmpty from 'lodash.isempty' 
import { setAuthenticated } from '../../redux/actions/auth-actions';

const useStyles = makeStyles({
    divStyle: {
        paddingLeft: '20%',
        paddingRight: '20%'
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
        setAuthenticated: (status) => dispatch(setAuthenticated(status)),
        pushKey: (key) => dispatch(pushKey(key)),
        popKey: () => dispatch(popKey())
    }
}

function FileList(props) {
    const classes = useStyles()


    return (
        <div
            className={classes.divStyle}>
            {props.newUser?
                <div>
                    Welcome to Kios! Please wait while we finish setting up your account. No need to go anywhere - this will update automagically!
                    <br/>
                    <br/>
                    <CircularProgress variant="indeterminate"/>
                </div>:
                <div>

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
                                            onClick={(event) => {
                                                    event.stopPropagation()
                                                    getS3Object(item.Key)
                                            }}
                                            >
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
            </div>
            }
            
            <br/>
            {props.search.history.length > 1?(<Button onClick={() => props.popKey()} variant="contained" color="primary">Up One Folder</Button>)
                :(<Button variant="contained" disabled>Up One Folder</Button>)}
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList)