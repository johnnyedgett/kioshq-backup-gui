import axios from 'axios'
import AWS from 'aws-sdk'
import isEmpty from 'lodash.isempty'

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

let URL = "https://3k2usm3hi3.execute-api.us-east-1.amazonaws.com/development"

export const getUserToken = (code, callback) => {
    console.log(`Going to try to call ${URL}/auth/generate?code=${code}`)
    axios.get(`${URL}/auth/generate?code=${code}`)
        .then(res=> { 
            console.log(res)
            if(res.data.id_token){
                localStorage.setItem('token', JSON.stringify(res.data))
                localStorage.setItem("tokenType", "idp")
                callback(true)
            }  
        })
        .catch(err => {
            console.log(err)
            callback(false)
        })
}

export const validateToken = (callback) => {

    let token = localStorage.getItem("token")
    if(!isEmpty(token)) {
        console.log(token)
        if(localStorage.getItem("tokenType") == "custom"){
            callback(true) // 
            return
        } else if (localStorage.getItem("tokenType") == "idp") {
            token = JSON.parse(localStorage.getItem("token")).id_token
        }
    } else if(isEmpty(token)) {
        console.log("the user does not have any token")
        callback(false)
        return
    }

    console.log(`Calling ${URL}/auth/validate?code=${token}`)
    axios.get(`${URL}/auth/validate?code=${token}`, { headers: { "authorizationToken": token } })
        .then(res => {
            console.log(res)
            if(res.data){ 
                callback(true)
            } else {
                localStorage.removeItem("token")
                localStorage.removeItem("tokenType")
                callback(false)
            }
        })
        .catch(err => {
            console.error("I got an error.,")
            callback(false)
        })
    }

export const registerUser = (user, callback) => {
    let pooldata = {
        UserPoolId: "us-east-1_7fYzC9gB5",
        ClientId: "5j94132ns34ihoj2gqtsr32lcq"
    }
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(pooldata)
    let cognitoUser
    let dataEmail = {
        Name: 'email',
        Value: 'cocakumar94@hotmail.com'
    }
    var attributeEmail = 
        new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    let attributeList = []
    attributeList.push(attributeEmail)

    console.log("Signing up a user %O", user)

    userPool.signUp(user.username, user.password, attributeList, null, (err, res) => {
        if(err)
            callback(err, false)
        else {
            cognitoUser = res.user    
            console.log(cognitoUser)
            callback(cognitoUser, true)
        }
    })
}

export const loginUser = (user, callback) => {
    let pooldata = {
        UserPoolId: "us-east-1_7fYzC9gB5",
        ClientId: "5j94132ns34ihoj2gqtsr32lcq"
    }
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(pooldata)

    var userData = {
        Username : user.username,
        Pool: userPool
    };

    let authenticationData = {
        Username: user.username,
        Password: user.password
    }

    let authDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData)
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

    console.log("trying to authenticate %O", user)
    const idp = "us-east-1:e710452b-401f-48d9-b673-1de1146855c1"

    cognitoUser.authenticateUser(authDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
            console.log('Got an accessToken %O', accessToken)

            // Lets log the user into the identityPool now
            cognitoUser.getSession((err, res) => {
                if(err){
                    console.error("Had an err, %O", err)

                } else if(res) {
                    console.log("Going to try to login with %O", result.getIdToken().getJwtToken())
                    AWS.config.region = 'us-east-1'
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: idp,
                        Logins: {
                            "cognito-idp.us-east-1.amazonaws.com/us-east-1_7fYzC9gB5": result.getIdToken().getJwtToken()                       
                        }
                    })
                    console.log("Token: %O", result.getIdToken())
                    AWS.config.credentials.get((err) => {
                        if(err)
                            console.error(err)
                        else {
                            localStorage.setItem("token", result.getIdToken().getJwtToken())
                            localStorage.setItem("tokenType", "custom")
                        }
                    })
                }
            })


            callback(accessToken, true)
        },
 
        onFailure: function(err) {
            console.error(err)
            callback(null, false)
        },

        mfaRequired: function(codeDeliveryDetails) {
            var verificationCode = prompt('Please input verification code' ,'');
            cognitoUser.sendMFACode(verificationCode, this);
        }
    });
}