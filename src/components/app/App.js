import React, { useState } from 'react'
import { createMuiTheme, MuiThemeProvider, Snackbar, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import { Switch, Route, Link } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import Homepage from '../homepage/Homepage'
import Redirect from '../redirect/Redirect'
import Register from '../register/Register'
import Login from '../login/Login'

const theme = createMuiTheme({
    palette: {
        primary: {
            500: '#4760ff'
        }
    }
})

export default function App(){
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')

    const handleClose = () => {
        setSnackbarOpen(false)
        setSnackbarMessage('')
    }
    
    return (
        <MuiThemeProvider theme={theme}>
            <div>
                <Navbar
                    setSnackbarMessage={setSnackbarMessage}
                    setSnackbarOpen={setSnackbarOpen}/>
                <Switch>
                    <Route exact path="/" component={(props) => {
                        return (
                            <Homepage
                                location={props.location}
                                setSnackbarMessage={setSnackbarMessage}
                                setSnackbarOpen={setSnackbarOpen}/>
                        )
                    }}/>
                    <Route exact path="/redirect" component={Redirect}/>
                    <Route exact path="/login" component={(props) => {
                        return (
                            <Login
                                location={props.location}
                                setSnackbarMessage={setSnackbarMessage}
                                setSnackbarOpen={setSnackbarOpen}/>
                        )
                    }}/>
                    <Route exact path="/register" component={(props) => { 
                        return (
                            <Register
                                location={props.location}
                                setSnackbarMessage={setSnackbarMessage}
                                setSnackbarOpen={setSnackbarOpen}/>
                        )
                    }}/>
                    <Route component={() => {
                        return (
                            <div align="center">
                                <h1>404 Not Found</h1>
                                <Link to="/">Return home here</Link>
                            </div>
                        )
                    }}/>
                </Switch>
            </div>
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{snackbarMessage}</span>}
                action={[
                    <IconButton
                      key="close"
                      aria-label="close"
                      color="inherit"
                      onClick={handleClose}
                    >
                      <CloseIcon />
                    </IconButton>,
                  ]}/>
        </MuiThemeProvider>
    )
}