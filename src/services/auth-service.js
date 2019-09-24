import axios from 'axios'
import AWS from 'aws-sdk'
import isEmpty from 'lodash.isempty'
import store from '../redux/store/store'
import { setAuthenticated } from '../redux/actions/auth-actions';

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

let URL = "https://3k2usm3hi3.execute-api.us-east-1.amazonaws.com/development"

export const getUserToken = async (code) => {
    return new Promise((resolve, reject) => {
        console.log(`Calling ${URL}/auth/generate?code=${code}`)
        axios.get(`${URL}/auth/generate?code=${code}`)
        .then(res=> { 
            console.log(res)
            if(res.data.id_token){
                localStorage.setItem('token', JSON.stringify(res.data))
                localStorage.setItem("tokenType", "idp")
                resolve(true)
            }  else {
                resolve(false)
            }
        })
        .catch(err => {
            console.error(err)
            reject(false)
        })
    })
}

export const validateToken = async (query, callback) => {
    if(query.code) {
        let z = await getUserToken(query.code)
        console.log("Success: %O", z)
    }


    let token = localStorage.getItem("token")

    if(!isEmpty(token)) {
        if(isEmpty(localStorage.getItem("tokenType"))) {
            // Not sure how the user doesn't have an assigned token type. Discard it
            callback(false)
        } else if(localStorage.getItem("tokenType") == "custom"){
            store.dispatch(setAuthenticated(true))
            callback(true) // Bad bandaid fix. This needs to be coded on the Lambda side to correctly validate the token
            return
        } else if (localStorage.getItem("tokenType") == "idp") {
            token = JSON.parse(localStorage.getItem("token")).id_token
        } 
    } else if(isEmpty(token)) {
        callback(false)
        return
    }

    axios.get(`${URL}/auth/validate?code=${token}`, { headers: { "authorizationToken": token } })
        .then(res => {
            if(res.data){ 
                const idp = "us-east-1:e710452b-401f-48d9-b673-1de1146855c1"
                let loginObject = localStorage.getItem("tokenType")==="idp"?{
                    "cognito-idp.us-east-1.amazonaws.com/us-east-1_lrLPpNt41": token
                }:{
                    "cognito-idp.us-east-1.amazonaws.com/us-east-1_7fYzC9gB5": token
                }
                AWS.config.region = 'us-east-1'
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: idp,
                    Logins: loginObject
                })
                AWS.config.credentials.get((err)=>{ 
                    if(err) console.error(err)
                    else callback(true)
                })
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
        Value: user.email
    }

    var attributeEmail = 
        new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

    let attributeList = []
    attributeList.push(attributeEmail)


    userPool.signUp(user.username, user.password, attributeList, null, (err, res) => {
        if(err) {
            console.error(err)
            callback(err, false)
        }
        else {
            cognitoUser = res.user    
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

    const idp = "us-east-1:e710452b-401f-48d9-b673-1de1146855c1"

    cognitoUser.authenticateUser(authDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();

            // Lets log the user into the identityPool now
            cognitoUser.getSession((err, res) => {
                if(err){
                    console.error("Had an err, %O", err)

                } else if(res) {
                    AWS.config.region = 'us-east-1'
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: idp,
                        Logins: {
                            "cognito-idp.us-east-1.amazonaws.com/us-east-1_7fYzC9gB5": result.getIdToken().getJwtToken()                       
                        }
                    })
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

export const confirmUser = (code, user, callback) => {
    let poolData = {
        UserPoolId: "us-east-1_7fYzC9gB5",
        ClientId: "5j94132ns34ihoj2gqtsr32lcq"
    }

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username : user,
        Pool : userPool
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
            callback(err, false)
            return;
        }
        console.log('call result: ' + result);
        callback(result, true)
    });
}