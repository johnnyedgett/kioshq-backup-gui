import React, { useState, useEffect } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import qs from 'query-string'
import { Switch, Route, Link, Redirect, withRouter } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import Homepage from '../homepage/Homepage'
import Register from '../register/Register'
import RegisterConfirm from '../register/RegisterConfirm'
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
    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {
        let query = qs.parse(window.location.search)
        console.log(query)
        validateToken(query, (success) => {
            if(success) {
                props.setAuthenticated(true)
                console.log(" I called back to the App homepage" )
                setFirstLoad(false)
            } else {
                console.log("Not successfully authenticated")
                setFirstLoad(false)
            }
        })
    }, [])

    const ProtectedRoute = ({ isAllowed, ...props }) => 
        firstLoad ?
                <Loading/>
                    : isAllowed ? <Route {...props}/> : <Redirect to="/login"/>

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

    const RegisterConfirmContainer = () => (
        <div className="registerConfirmContainer">
            <Route exact path="/" render={() => <Redirect to="/confirm"/>}/>
            <Route path="/confirm" component={RegisterConfirm}/>
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
                    <Route exact path="/(confirm)" component={RegisterConfirmContainer}/>
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
        </MuiThemeProvider>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App))