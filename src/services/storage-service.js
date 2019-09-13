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
            let params = {
                Bucket: bucketName,
                Prefix: `${AWS.config.credentials.identityId}`
            }
            console.log('Params %O', params)
            s3.listObjects(params, (err, data) => {
                if(err) {
                    console.error(err)
                    callback(null, false)
                }
                else 
                callback(data, true)
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