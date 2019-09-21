import React, { useState, useEffect } from 'react'
import { Typography, Button, Grid, Paper, TextField, makeStyles } from '@material-ui/core';
import isEmpty from 'lodash.isempty'
import { Link } from 'react-router-dom'
import { confirmUser } from '../../services/auth-service';
import qs from 'query-string'
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
    const [code, setCode] = useState('')
    const [user, setUser] = useState('')
    const [showUserPrompt, setShowUserPrompt] = useState(false)

    const handleConfirmationResponse = (data, success) => {
        if(success) {
            history.push({
                pathname: '/login',
                state: { confirmed: true }
            })
        }
    }

    useEffect(() => {
        if(isEmpty(localStorage.getItem("cu"))){
            let query = qs.parse(props.location.search)
            if(query.user) {
                setUser(query.user)
            } else {
                // No username, prompt for a username
                setShowUserPrompt(true)
            }
        } else {
            let userData = JSON.parse(localStorage.getItem("cu"))
            if(userData.username) {
                console.log(userData.username)
                setUser(userData.username)
            } else {
                setShowUserPrompt(true)
            }
        }
    }, [props.location])

    return (
        <div align="center" className={classes.root}>
            <Paper className={classes.paper}>
                <br/>
                <Grid container direction="column" justify="center" alignContent="center" alignItems="center" spacing={2}>
                    <Grid item>
                        <Typography variant="h6">Please input your verification code below</Typography>
                    </Grid>
                    {showUserPrompt?<Grid item>
                        <TextField
                            variant="outlined"
                            required
                            label="username"
                            placeholder="username"
                            value={user}
                            onChange={(event) => setUser(event.target.value)}/>
                    </Grid>:<span/>}
                    <Grid item>
                        <TextField
                            variant="outlined"
                            label="code"
                            placeholder="123456"
                            required
                            value={code}
                            onChange={(event) => { setCode(event.target.value)}}/>
                    </Grid>
                    <Grid item>
                        <Button
                            onClick={() => confirmUser(code, user, handleConfirmationResponse)}
                            variant="contained"
                            color="primary"
                            disabled={isEmpty(code)}>
                                Submit confirmation code
                            </Button>
                    </Grid>
                </Grid>
                <br/>
                <br/>
                <Link to="/register">Didn't receive a code?</Link>
                <br/>
                <br/>
            </Paper>
        </div>
    )
}