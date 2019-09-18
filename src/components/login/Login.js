import React, { useState } from 'react'
import { Button, Grid, TextField, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles';
import isEmpty from 'lodash.isempty'
import { Link } from 'react-router-dom'
import { loginUser } from '../../services/auth-service';
import history from '../../util/history'

let url = "https://kios-gidp.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=2lhs1j0ndljittj7294mvd5dnp&redirect_uri=https://www.kioshq.com"

const useStyles = makeStyles({ 
    root: {
        paddingLeft: '30vw',
        paddingRight: '30vw'
    },
    paper: {
        border: '1px solid #e7e7e7',
        boxShadow: '0 0 0 0'
    }
})
export default function Login(props){
    const classes = useStyles()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleUserLogin = (data, success) => {
        if(success) {
            console.log('I have successfully authenticated the user. %O', data)
            setTimeout(() => {
                history.push("/")
            }, 1200)
        } else {
            setLoading(false)
            setError(true)
        }
    }

    return (
        <div align="center" className={classes.root}>
            <Paper
                className={classes.paper}>
                <br/>
                <Button variant="contained" color="primary" href={`${url}`}>Login with Google</Button>
                <br/>
                <br/>
                <br/>
                Or, sign in with your KiosHQ credentials below.
                <br/>
                <br/>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <TextField
                            label="username"
                            variant="outlined"
                            disabled={loading}
                            placeholder="Username/Email here..."
                            value={username}
                            onChange={(event) => { setUsername(event.target.value)}}/>
                    </Grid>
                    <Grid item>
                        <TextField
                            label="password"
                            disabled={loading}
                            variant="outlined"
                            type="password"
                            placeholder="Password here..."
                            value={password}
                            onChange={(event) => { setPassword(event.target.value)}}/>
                    </Grid>
                    <Grid item>
                        <Button
                            disabled={(isEmpty(username) && isEmpty(password)) || loading}
                            onClick={() => {
                                console.log('I need to sign this user in')
                                setLoading(true)
                                setError(false)
                                loginUser({
                                    username: username,
                                    password: password
                                }, handleUserLogin)
                            }}
                            variant="contained"
                            color="primary">
                                Sign in!
                            </Button>
                    </Grid>
                </Grid>
                <br/>
                {loading?<div>Trying to log you in...</div>:<br/>}
                {error?<div><Typography variant="body2" style={{ color: 'red' }}>There was an error. Please try again.</Typography></div>:<br/>}
                <Link to="/register">No account? No problem. Click here.</Link>
                <br/>
                <br/>
            </Paper>
        </div>
    )
}