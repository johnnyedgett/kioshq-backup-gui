import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

function FileDropzone() {
    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles)
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
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    )
}

export default FileDropzone