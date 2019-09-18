import React, { useState } from 'react'
import { Typography, Button, Grid, Paper, TextField, makeStyles } from '@material-ui/core';
import isEmpty from 'lodash.isempty'
import { Link } from 'react-router-dom'
import { registerUser } from '../../services/auth-service';

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

export default function Register(props){
    const classes = useStyles()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUserRegistered = (data, success) => {
        console.log("Successful: %O, Response: %O", success, data)
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
                            label="username"
                            variant="outlined"
                            placeholder="Username/Email here..."
                            value={username}
                            onChange={(event) => { setUsername(event.target.value)}}/>
                    </Grid>
                    <Grid item>
                        <TextField
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
                                    username: username, password: password
                                }, handleUserRegistered)
                            }}
                            variant="contained"
                            color="primary">
                                Sign Up!
                            </Button>
                    </Grid>
                </Grid>
                <br/>
                <br/>
                <Link to="/login">Already have an account? No problem. Click here.</Link>
                <br/>
                <br/>
            </Paper>
        </div>
    )
}