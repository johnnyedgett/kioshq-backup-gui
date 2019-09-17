import axios from 'axios'

let URL = "https://3k2usm3hi3.execute-api.us-east-1.amazonaws.com/development"

export const getUserToken = (code, callback) => {
    axios.get(`${URL}/auth/generate?code=${code}`)
        .then(res=> { 
            console.log(res)
            if(res.data.id_token){
                localStorage.setItem('token', JSON.stringify(res.data))
                // console.log('token saved')
                // res.data.id_token,
                callback(true)
            }  
        })
        .catch(err => {
            console.log(err)
            callback(false)
        })
}

export const validateToken = (callback) => {
    console.log(localStorage.getItem("token"))
    if(localStorage.getItem("token") == null) { 
        callback(false) 
    } else {
        let parsed = JSON.parse(localStorage.getItem("token"))
        axios.get(`${URL}/auth/validate?code=${parsed.id_token}`, {
                headers: { 
                    "authorizationToken": parsed.id_token
                }
            })
            .then(res => {
                console.log(res)
                if(res.data){ 
                    callback(true)
                } else {
                    localStorage.removeItem('token')
                    callback(false)
                }
            })
    }
}