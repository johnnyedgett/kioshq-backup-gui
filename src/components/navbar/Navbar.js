import React from 'react'
import { makeStyles, AppBar, Toolbar, IconButton } from '@material-ui/core'
import { Menu } from '@material-ui/icons'

const useStyles = makeStyles({
    navtitle: {
        flexGrow: 1
    }
})

export default function Navbar(props) {
    const classes = useStyles()
    return (
        <AppBar
            position="static"
            elevation={0}
            color="primary"
            className={classes.navtitle}>
            <Toolbar>
                <IconButton
                    color="inherit">
                    <Menu/>
                </IconButton>
                Kios Software Backup
            </Toolbar>
        </AppBar>
    )
}