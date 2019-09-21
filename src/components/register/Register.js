import React, { useState } from 'react'
import { Typography, Button, Grid, Paper, TextField, makeStyles } from '@material-ui/core';
import isEmpty from 'lodash.isempty'
import { Link } from 'react-router-dom'
import { registerUser } from '../../services/auth-service';
import history from '../../util/history'

const useStyles = makeStyles({ 
    root: {
        paddingLeft: '30vw',
        paddingRight: '30vw',
        paddingTop: '20vh'
    },
    paper: {
        border: '1px solid #e7e7e7',
        boxShadow: '0 0 0 0'
    },
    textField: {
        width: '100%'
    }
})

export default function Register(props){
    const classes = useStyles()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleUserRegistered = (data, success) => {
        if(success) {
            console.log("Successful: %O, Response: %O", success, data)
            localStorage.setItem("cu", JSON.stringify(data));
            history.push({
                pathname: '/confirm',
                state: { cameFromRegister: true }
            })
        } else {
            setError(true)
            setErrorMessage(data.message)
        }
    }

    return (
        <div align="center" className={classes.root}>
            <Paper className={classes.paper}>
                <br/>
                <Grid container direction="column" justify="center" alignContent="center" alignItems="center" spacing={2}>
                    <Grid item>
                        <Typography>Register</Typography>
                    </Grid>
                    <Grid item>
                        <Button>Register with Google</Button>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">or...</Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            className={classes.textField}
                            label="email"
                            variant="outlined"
                            required
                            placeholder="Email here..."
                            value={email}
                            onChange={(event) => { setEmail(event.target.value)}}
                            type="email"
                            required/>
                    </Grid>
                    <Grid item>
                        <TextField
                            label="username"
                            variant="outlined"
                            placeholder="(Optional) Username here..."
                            value={username}
                            onChange={(event) => { setUsername(event.target.value)}}/>
                    </Grid>
                    <Grid item>
                        <TextField
                            required
                            label="password"
                            variant="outlined"
                            type="password"
                            placeholder="Password here..."
                            value={password}
                            onChange={(event) => { setPassword(event.target.value)}}/>
                    </Grid>
                    <Grid item>
                        <Button
                            disabled={(isEmpty(username) && isEmpty(password))}
                            onClick={() => {
                                console.log('I need to sign this user in')
                                registerUser({
                                    email: email, username: username, password: password
                                }, handleUserRegistered)
                            }}
                            variant="contained"
                            color="primary">
                                Sign Up!
                            </Button>
                    </Grid>
                </Grid>
                {error?<div style={{ color: 'red' }}><br/>There was an error: {errorMessage}<br/></div>:<span/>}
                <br/>
                <br/>
                <Link to="/login">Already have an account? No problem. Click here.</Link>
                <br/>
                <br/>
            </Paper>
        </div>
    )
}