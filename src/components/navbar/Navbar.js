import React from 'react'
import { makeStyles, AppBar, Toolbar, IconButton, Button, Typography, Link } from '@material-ui/core'
import { Menu } from '@material-ui/icons'
import history from '../../util/history'
import { connect } from 'react-redux'
import { setAuthenticated } from '../../redux/actions/auth-actions'
import { setSnackbarMessage, setSnackbarVisible } from '../../redux/actions/snackbar-actions'

const useStyles = makeStyles({
    navtitle: {
        flexGrow: 1
    }
})

const mapStateToProps = state => {
    return {
        auth: state.auth,
        snackbar: state.snackbar
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setAuthenticated: (status) => dispatch(setAuthenticated(status)),
        setSnackbarMessage: (message) => dispatch(setSnackbarMessage(message)),
        setSnackbarVisible: (visible) => dispatch(setSnackbarVisible(visible))
    }
}

function Navbar(props) {
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
                <div style={{ flexGrow: 1}}/>
                {props.auth.authenticated?(
                    <Button variant="text" onClick={() => { 
                        localStorage.clear();
                        props.setSnackbarMessage('Successfully signed out!')
                        props.setSnackbarVisible(true)
                        history.push("/login")
                        props.setAuthenticated(false)
                    }}>
                        <div style={{ color: 'white' }}>Sign out</div>
                    </Button>
                ):<span/>}

            </Toolbar>
        </AppBar>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)