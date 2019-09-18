import AWS from 'aws-sdk'
import axios from 'axios'
import isEmpty from 'lodash.isempty'

const idp = "us-east-1:e710452b-401f-48d9-b673-1de1146855c1"
const bucketName = "kiosbackup-standard"

export const getManifest = (prefix, callback) => {
    let token = localStorage.getItem("token")
    if(!isEmpty(token)) {
        if(localStorage.getItem("tokenType") == "custom"){

        } else if (localStorage.getItem("tokenType") == "idp") {
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
                    callback(null, false)
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

                    callback(tmp, true)
                }
            })
        }
    })
}

export const getS3Object = (key, callback) => {
    let token = localStorage.getItem("token")
    if(!isEmpty(token)) {
        if(localStorage.getItem("tokenType") == "custom"){

        } else if (localStorage.getItem("tokenType") == "idp") {
            token = JSON.parse(localStorage.getItem("token")).id_token
        }
    }
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

export const doUpload = (key, file, callback) => {
    let token = localStorage.getItem("token")
    if(!isEmpty(token)) {
        if(localStorage.getItem("tokenType") == "custom"){

        } else if (localStorage.getItem("tokenType") == "idp") {
            token = JSON.parse(localStorage.getItem("token")).id_token
        }
    }
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
                Key: key,
                Body: file
            }
            s3.upload(params, (err, data)=> {
                if(err){ 
                    console.error(err)
                    callback(null, false)
                } else {
                    console.log(data)
                    callback(data, true)
                }
            })
            console.log('Params %O', params)
        }
    })
}

// export const getS3UploadURL = (key, fileType, file, callback) => {
//     let token = JSON.parse(localStorage.getItem("token")).id_token
//     if(isEmpty(token)) 
//         callback(null, null, false)
//     else {
//         AWS.config.region = 'us-east-1'
//         AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//             IdentityPoolId: idp,
//             Logins: {
//                 "cognito-idp.us-east-1.amazonaws.com/us-east-1_lrLPpNt41": token
//             }
//         })
//         AWS.config.credentials.get((err) => {
//             if(err) console.log('Error: %O', err)
//             else {
//                 let s3 = new AWS.S3({
//                     apiVersion: '2006-03-01'
//                 })
//                 let params = {
//                     Bucket: bucketName,
//                     Key: key,
//                     ContentType: "multipart/form-data"
//                 }
//                 console.log('Paams %O', params)
//                 let url = s3.getSignedUrl('putObject', params)
//                 if(url) callback(file, url, true)
//             }
//         })
//     }
// }

// export const doUpload = (file, url, key) => {

//     let data = new FormData()
//     data.append('images[0]', file, key + file.name)

//     axios.post(url, data, {
//         headers: { 'content-type': 'multipart/form-data' }
//     }, )
//     .then(res => {
//         console.log(res)
//     })
//     .catch(err=>{
//         console.error("Encountered an error while uploading: %O", err)
//     })
// }