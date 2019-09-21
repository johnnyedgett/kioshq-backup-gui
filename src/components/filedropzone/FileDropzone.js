import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash.isempty'
import { connect } from 'react-redux'
import { doUpload } from '../../services/storage-service'
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        paddingLeft: '20vw',
        paddingRight: '20vw',
        border: '1px solid black',
        backgroundColor: '',
        zIndex: 1,
        display: 'block',
        margin: '0 auto'
    }
})

const mapStateToProps = state => {
    return {
        search: state.search
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}
function FileDropzone(props) {
    const classes = useStyles()
    const [files, setFiles] = useState([])

    useEffect(() => {
        console.log(files)
        if(!isEmpty(files)) {
            files.forEach(f => {
                doUpload(`${props.search.history[props.search.history.length-1]}${f.name}`, f, uploadResponse)
            })
        }
    }, [props.search.history, files])

    const uploadResponse = (details, success) => {
        if(success){
            props.triggerReload()
        }
        else{
            console.log('There was an error with hte upload')
        }
    }

    const onDrop = useCallback(acceptedFiles => {
        console.log('going to set the files')
        setFiles(acceptedFiles) // then do something for each of them
    }, [])
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

    return (
        <div { ...getRootProps()} align="center" className={classes.root}>
            <input {...getInputProps()} />
            {
                isDragActive?
                    <p>Drop the files here...</p> :
                    !isEmpty(files)?(
                    <div>
                        {files.map((f, i) => { 
                            return (<p key={i}>{f.name}</p>)})}
                    </div>
                    ):(<p>Drag 'n' drop some files here, or click to select files</p>)
            }
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(FileDropzone)