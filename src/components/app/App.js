import React, { useState, useEffect } from 'react'
import { createMuiTheme, MuiThemeProvider, Snackbar, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import Homepage from '../homepage/Homepage'
import Register from '../register/Register'
import Login from '../login/Login'
import Loading from '../loading/Loading'
import { setAuthenticated } from '../../redux/actions/auth-actions';
import { connect } from 'react-redux'
import { validateToken } from '../../services/auth-service'

const theme = createMuiTheme({
    palette: {
        primary: {
            500: '#4760ff'
        }
    }
})

const mapStateToProps = state => {
    return {
        auth: state.auth,
        flow: state.flow
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setAuthenticated: (status) => dispatch(setAuthenticated(status))
    }
}

function App(props){
    // Check if the user is authenticate
    useEffect(() => {
        validateToken(() => {

        })
    }, [])

    const ProtectedRoute = ({ isAllowed, ...props }) => 
       isAllowed ? <Route {...props}/> : <Redirect to="/login"/>;

    const LoginContainer = () => (
        <div className="loginContainer">
            <Route exact path="/" render={() => <Redirect to="/login"/>}/>
            <Route path="/login" component={Login}/>
        </div>
    )

    const RegisterContainer = () => (
        <div className="registerContainer">
            <Route exact path="/" render={() => <Redirect to="/register"/>}/>
            <Route path="/register" component={Register}/>
        </div>
    )

    const DefaultContainer = () => (
        <div>
            <Navbar/>
            <ProtectedRoute 
                isAllowed={props.auth.authenticated}
                exact 
                path="/" 
                component={Homepage}/>
        </div>
    )

    return (
        <MuiThemeProvider theme={theme}>
            <div>
                <Switch>
                    <Route exact path="/(login)" component={LoginContainer}/>
                    <Route exact path="/(register)" component={RegisterContainer}/>
                    <Route exact path="/" component={DefaultContainer}/>
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
            {props.flow.loading?<Loading/>:<span/>}
        </MuiThemeProvider>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(App)