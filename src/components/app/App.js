import React from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import { Switch, Route, Link } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import Homepage from '../homepage/Homepage'
import Redirect from '../redirect/Redirect'

const theme = createMuiTheme({
    palette: {
        primary: {
            500: '#4760ff'
        }
    }
})

export default function App(){
    return (
        <MuiThemeProvider theme={theme}>
            <div>
                <Navbar/>
                <Switch>
                    <Route exact path="/" component={Homepage}/>
                    <Route exact path="/redirect" component={Redirect}/>
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