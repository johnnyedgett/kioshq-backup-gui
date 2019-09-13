import React, { useEffect, useState } from 'react'
import history from '../../util/history'
import qs from 'query-string'

export default function Redirect(props) {
    const [redirectURL, setRedirectURL] = useState('')
    useEffect(() => {
        if(!props.location.search){
            history.push("/error")
        }
        else {
            let query = qs.parse(props.location.search)
            setRedirectURL(query.url)
            setTimeout(() => {
                window.location.href = query.url
            }, 3000)
        }
    }, [props.location.search])

    return (
        <div align="center">
            <br/>
            You will be redirected to {redirectURL} soon.
            <br/>
            <br/>
            Please click <a href={redirectURL}>here</a> if you are not redirected
        </div>
    )
}