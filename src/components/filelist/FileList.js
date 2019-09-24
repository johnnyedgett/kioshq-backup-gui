import React from 'react'
import { IconButton, makeStyles, Table, TableHead, TableRow, TableBody, TableCell, Button, CircularProgress, Grid } from '@material-ui/core'
import { getS3Object } from '../../services/storage-service'
import { SaveAlt, Folder } from '@material-ui/icons'
import { connect } from 'react-redux'
import { setManifest, setSelectedItem } from '../../redux/actions/manifest-actions'
import { pushKey, popKey } from '../../redux/actions/search-actions'
import { setAuthenticated } from '../../redux/actions/auth-actions';

const useStyles = makeStyles({
    divStyleDesktop: {
        paddingLeft: '20%',
        paddingRight: '20%',
        // width: '100%'
    },
    divStyleMobile: {

    },
    tableStyle: {
        border: '1px solid grey',
        maxWidth: '100%'
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
        search: state.search,
        mobile: state.mobile
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
            className={props.mobile.mobile?classes.divStyleMobile:classes.divStyleDesktop}>
            {props.newUser?
                <div>
                    Welcome to Kios! Please wait while we finish setting up your account. No need to go anywhere - this will update automagically!
                    <br/>
                    <br/>
                    <CircularProgress variant="indeterminate"/>
                </div>:
                <div style={{ overflowX: 'auto' }}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Table
                                className={classes.tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: '2vw'}}>Icon</TableCell>
                                    <TableCell style={{ width: '8vw'}}>File</TableCell>
                                    <TableCell style={{ width: '2vw'}}>Size</TableCell>
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
                                            <TableCell
                                                style={{ width: '3vw'}}>
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
                                            <TableCell style={{ width: '3vw'}}>{matched[2]}</TableCell>
                                            <TableCell style={{ width: '3vw'}}>1234 KB {item.isFolder?('(NESTED)'):('')}</TableCell>
                                        </TableRow>
                                    ))
                                })}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </div>
            }
            
            <br/>
            {props.search.history.length > 1?(<Button onClick={() => props.popKey()} variant="contained" color="primary">Up One Folder</Button>)
                :(<Button variant="contained" disabled>Up One Folder</Button>)}
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList)