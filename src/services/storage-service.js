import AWS from 'aws-sdk'
import axios from 'axios'

const idp = "us-east-1:e710452b-401f-48d9-b673-1de1146855c1"
const bucketName = "kiosbackup-standard"

export const loadInitialManifest = (token, callback) => {
    console.log('Time for the magic to happen. %O', token)
    if(!token) 
        callback(null, false)
    AWS.config.region = 'us-east-1'
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: idp,
        Logins: {
            "cognito-idp.us-east-1.amazonaws.com/us-east-1_lrLPpNt41": token
        }
    })
    AWS.config.credentials.get((err) => {
        if(err) console.log('Error: %O', err)
        else {
            let s3 = new AWS.S3({
                apiVersion: '2006-03-01'
            })
            const key = `${AWS.config.credentials.identityId}/`
            let params = {
                Bucket: bucketName,
                Prefix: key,
                Delimiter: '/'
            }
            console.log('Params %O', params)
            s3.listObjectsV2(params, (err, data) => {
                if(err) {
                    console.error(err)
                    callback(null, false)
                }
                else {
                    let tmp = []

                    tmp = Object.assign([], data.Contents)

                    data.CommonPrefixes.forEach((e, i) => {
                        data.CommonPrefixes.splice(i, 1)
                        e.Key = e.Prefix
                        tmp.push(e)
                    })

                    callback(tmp, true, key)
                }
            })
        }
    })
}

export const getManifest = (prefix, token, callback) => {
    if(!token) 
        callback(null, false)
    AWS.config.region = 'us-east-1'
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: idp,
        Logins: {
            "cognito-idp.us-east-1.amazonaws.com/us-east-1_lrLPpNt41": token
        }
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
            console.log('Params %O', params)
            s3.listObjectsV2(params, (err, data) => {
                if(err) {
                    console.error(err)
                    callback(null, false)
                }
                else {
                    let tmp = []

                    tmp = Object.assign([], data.Contents)

                    data.CommonPrefixes.forEach((e, i) => {
                        data.CommonPrefixes.splice(i, 1)
                        e.Key = e.Prefix
                        tmp.push(e)
                    })

                    callback(tmp, true)
                }
            })
        }
    })
}

export const getS3Object = (token, key, callback) => {
    AWS.config.region = 'us-east-1'
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: idp,
        Logins: {
            "cognito-idp.us-east-1.amazonaws.com/us-east-1_lrLPpNt41": token
        }
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

export const getS3UploadURL = (token, key, callback) => {
    console.log(token)
    AWS.config.region = 'us-east-1'
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: idp,
        Logins: {
            "cognito-idp.us-east-1.amazonaws.com/us-east-1_lrLPpNt41": token
        }
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
                ContentType: 'image/png'
            }
            console.log('Params %O', params)
            let url = s3.getSignedUrl('putObject', params)
            if(url) callback(url, true)
        }
    })
}