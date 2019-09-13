import axios from 'axios'

let URL = "https://3k2usm3hi3.execute-api.us-east-1.amazonaws.com/development"

export const getUserToken = (code, callback) => {
    axios.get(`${URL}/auth/generate?code=${code}`)
        .then(res=> { 
            console.log(res)
            if(res.data.id_token){
                localStorage.setItem('token', JSON.stringify(res.data))
                console.log('token saved')
                callback(res.data.id_token, true)
            }  
        })
        .catch(err => {
            console.log(err)
            callback(null, false)
        })
}

export const validateToken = (jwt, callback) => {
    let parsed = JSON.parse(jwt)
    console.log('Going to check %O', parsed)
    axios.get(`${URL}/auth/validate?code=${parsed.id_token}`, {
            headers: { 
                "authorizationToken": parsed.id_token
            }
        })
        .then(res => {
            console.log(res)
            if(res.data){ 
                console.log('token is valid and can stay')
                callback(true)
            } else {
                
                localStorage.removeItem('token')
                callback(false)
            }
        })
}