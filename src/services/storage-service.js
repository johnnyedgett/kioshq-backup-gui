import AWS from 'aws-sdk'
import axios from 'axios'
import isEmpty from 'lodash.isempty'
import store from '../redux/store/store'

const API_GATEWAY_URL = "https://3k2usm3hi3.execute-api.us-east-1.amazonaws.com/development"
const idp = "us-east-1:e710452b-401f-48d9-b673-1de1146855c1"
const bucketName = "kiosbackup-standard"

export const getManifest = (prefix, callback) => {
    let token = localStorage.getItem("token")
    if(!isEmpty(token)) {
        if(localStorage.getItem("tokenType") === "custom"){

        } else if (localStorage.getItem("tokenType") === "idp") {
            token = JSON.parse(localStorage.getItem("token")).id_token
        }
    }
    if(!token) 
        callback(null, false)

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
    AWS.config.credentials.get((err) => {
        if(err) console.log('Error: %O', err)
        else {
            let s3 = new AWS.S3({
                apiVersion: '2006-03-01'
            })
            let params = {
                Bucket: bucketName,
                Prefix: prefix,
                Delimiter: '/'
            }
            // console.log('Params %O', params)
            s3.listObjectsV2(params, (err, data) => {
                if(err) {
                    console.error(err)
                    callback(null, false, false)
                }
                else {
                    console.log(data)
                    let tmp = []

                    tmp = Object.assign([], data.Contents)

                    data.CommonPrefixes.forEach((e, i) => {
                        data.CommonPrefixes.splice(i, 1)
                        e.Key = e.Prefix
                        tmp.push(e)
                    })

                    if(isEmpty(tmp)) {
                        console.log('Call the create user method, and indicate that some way.')
                        callback(tmp, true, true)
                    }

                    callback(tmp, true, false)
                }
            })
        }
    })
}

export const getS3Object = (key, callback) => {
    console.log("Im trying to download %O", key)
    
    let token = localStorage.getItem("token")
    if(!isEmpty(token)) {
        if(localStorage.getItem("tokenType") === "custom"){

        } else if (localStorage.getItem("tokenType") === "idp") {
            token = JSON.parse(localStorage.getItem("token")).id_token
        }
    }
    if(!token) {
        callback(null, false)
    }

    let loginObject = localStorage.getItem("tokenType") === "idp"?{
        "cognito-idp.us-east-1.amazonaws.com/us-east-1_lrLPpNt41": token
    }:{
        "cognito-idp.us-east-1.amazonaws.com/us-east-1_7fYzC9gB5": token
    }
    AWS.config.region = 'us-east-1'
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: idp,
        Logins: loginObject
    })
    AWS.config.credentials.get((err) => {
        if(err) console.log('Error: %O', err)
        else {
            let s3 = new AWS.S3({
                apiVersion: '2006-03-01'
            })
            let params = {
                Bucket: bucketName,
                Key: key
            }
            console.log('Params %O', params)
            let url = s3.getSignedUrl('getObject', params)

            const regex = /.+?(?=\/)\/(.*)/
            console.log(key)
            console.log(key.match(regex))
            let fName = key.match(regex)[1]

            axios({
                url: url,
                method: 'GET',
                responseType: 'blob'
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fName);
                document.body.appendChild(link);
                link.click();
              });
        }
    })
}

export const doUpload = (key, file, callback) => {
    let token = localStorage.getItem("token")
    if(!isEmpty(token)) {
        if(localStorage.getItem("tokenType") === "custom"){
            
        } else if (localStorage.getItem("tokenType") === "idp") {
            token = JSON.parse(localStorage.getItem("token")).id_token
        }
    }
    if(!token) 
        callback(null, false)

    let loginObject = localStorage.getItem("tokenType") === "idp"?{
        "cognito-idp.us-east-1.amazonaws.com/us-east-1_lrLPpNt41": token
    }:{
        "cognito-idp.us-east-1.amazonaws.com/us-east-1_7fYzC9gB5": token
    }

    AWS.config.region = 'us-east-1'
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: idp,
        Logins: loginObject
    })
    AWS.config.credentials.get((err) => {
        if(err) console.log('Error: %O', err)
        else {
            let s3 = new AWS.S3({
                apiVersion: '2006-03-01'
            })
            let params = {
                Bucket: bucketName,
                Key: key,
                Body: file
            }
            s3.upload(params, (err, data)=> {
                if(err){ 
                    console.error(err)
                    callback(null, false)
                } else {
                    console.log(data)
                    console.log('hotdog')
                    callback(data, true)
                }
            })
            console.log('Params %O', params)
        }
    })
}


// https://3k2usm3hi3.execute-api.us-east-1.amazonaws.com/development/auth/create?userId=us-east-1:3d4cc673-83df-4d33-9515-6138a099ac89
export const createUserFolder = (callback) => {
    // FLOW 1 - tokenType = "custom"
    let token = localStorage.getItem("token")
    if(!isEmpty(token)) {
        if(localStorage.getItem("tokenType") === "custom"){
            
        } else if (localStorage.getItem("tokenType") === "idp") {
            token = JSON.parse(localStorage.getItem("token")).id_token
        }
    }
    if(!token) 
        callback(null, false)

    let userId = localStorage.getItem("aws.cognito.identity-id.us-east-1:e710452b-401f-48d9-b673-1de1146855c1")
    console.log(`I am going to call ${API_GATEWAY_URL}/auth/create?userId=${userId}`)
    axios.get(`${API_GATEWAY_URL}/auth/create?userId=${userId}`, { headers: { "Authorization": token}})
        .then(res => {
            console.log(res)
            if(res.status === 204)
                callback(res, true)
            else callback(res, false)
        })
        .catch(err => {
            console.error(err)
            callback(err, false)
        })
}