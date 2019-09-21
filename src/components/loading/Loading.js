import React from 'react'
import { makeStyles, CircularProgress } from '@material-ui/core'

const useStyles = makeStyles({
    root: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        opacity: '0.5',
        zIndex: 1
    }
})

export default function Loading(props){
    const classes = useStyles()
    return (
        <div
            className={classes.root}>
                <div align="center" style={{ paddingTop: '20%'}}>
                    <CircularProgress/>
                </div>
        </div>
    )
}