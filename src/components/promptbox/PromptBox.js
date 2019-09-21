import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@material-ui/core';

export default function PromptBox(props) {
    const [input, setInput] = useState('')

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}>
            <DialogTitle>{props.prompt.title}</DialogTitle>
            <DialogContent>
                <TextField
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    label="Input"
                    placeholder="Type here..."/>
            </DialogContent>
            <DialogActions>
                <Button 
                    variant="text" 
                    onClick={() => {
                        props.submitValue(input)
                    }}>
                    Submit
                </Button>
                <Button 
                    variant="text" 
                    onClick={() => {
                        props.onClose()
                    }}>
                    Close Dialog Box
                </Button>

            </DialogActions>
        </Dialog>
    )
}

// // Ex: Prompt
// { 
//     "title": "Enter folder name",

// }