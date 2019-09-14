import React from 'react'
import { List, ListItem } from '@material-ui/core'
import { getS3Object } from '../../services/storage-service'

export default function FileList(props) {

    const handleS3Response = (data, success) => {
        if(success) {
            console.log(data)
        }
    }

    const regex = /.+?(?=\/)\/(.*)/

    return (
        <div>
            <List
                style={{
                    paddingLeft: '20%',
                    paddingRight: '20%'
                }}>
                {props.files.map((item, i) => {
                    // console.log(item.Key.match(regex))
                    return (
                        <ListItem
                            button
                            key={i}
                            onClick={() => { 
                                getS3Object(JSON.parse(localStorage.getItem("token")).id_token, item.Key, handleS3Response) 
                                }}>
                            {item.Key}
                        </ListItem>
                    )
                })}
            </List>
        </div>
    )
}

{/* <ListItem>
<ListItemAvatar>
<Avatar>
<FolderIcon />
</Avatar>
</ListItemAvatar>
<ListItemText
primary="Single-line item"
secondary={secondary ? 'Secondary text' : null}
/>
<ListItemSecondaryAction>
<IconButton edge="end" aria-label="delete">
<DeleteIcon />
</IconButton>
</ListItemSecondaryAction>
</ListItem>, */}