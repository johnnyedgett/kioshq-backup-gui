import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash.isempty'
import { connect } from 'react-redux'
import { doUpload } from '../../services/storage-service'

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
    const [files, setFiles] = useState([])

    useEffect(() => {
        console.log(files)
        if(!isEmpty(files)) {
            // get the s3 upload urls for all of them
            files.forEach(f => {
                doUpload(`${props.search.history[props.search.history.length-1]}${f.name}`, f, uploadResponse)
            })
        }
    }, [props.search.history, files])

    const uploadResponse = (details, success) => {
        if(success){

        }
        else{
            console.log('There was an error with hte upload')
        }
    }

    const onDrop = useCallback(acceptedFiles => {
        console.log('going to set the files')
        acceptedFiles.forEach(f => {
            
        })
        setFiles(acceptedFiles) // then do something for each of them
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

    return (
        <div { ...getRootProps()} align="center"
            style={{ 
                border: '1px solid #f8f8f8',
                backgroundColor: '',
                zIndex: 1,
            }}>
            <input {...getInputProps()} />
            {
                isDragActive?
                    <p>Drop the files here...</p> :
                    !isEmpty(files)?(
                    <div>
                        {files.map((f, i) => { 
                            console.log(f)
                            return (
                                <p key={i}>{f.name}</p>)})}
                    </div>
                    ):
                        (<p>Drag 'n' drop some files here, or click to select files</p>)
            }
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(FileDropzone)