import React, { useEffect, useState } from 'react'
import { Drawer, Button, makeStyles } from '@material-ui/core'
import isEmpty from 'lodash.isempty'
import { connect } from 'react-redux'
import { setSelectedItem } from '../../redux/actions/manifest-actions'

const useStyles = makeStyles({
    drawerStyle: {
        width: 350
    },
    divStyle: {
        width: 350,
        align: 'center'
    }
})

const mapStateToProps = state => {
    return {
        manifest: state.manifest
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setSelectedItem: (item) => dispatch(setSelectedItem(item))
    }
}

function DetailsDrawer(props){
    const classes = useStyles()
    const [name, setName] = useState('')

    useEffect(() => {
        let regex = /(.{1})\/(.*)/
        if(!isEmpty(props.manifest.selectedItem)) {
            console.log(props.manifest.selectedItem)
            setName(props.manifest.selectedItem.Key.match(regex)[2])
        }
    }, [props.manifest])

    return (
        <Drawer
            open={!isEmpty(props.manifest.selectedItem)}
            anchor="right"
            className={classes.drawerStyle}>
                <div
                    align="center"
                    className={classes.divStyle}>
                    Viewing details for <b>{name}</b>

                    <br/>
                    <Button onClick={ () => props.setSelectedItem({}) }>Close Drawer</Button>
                </div>
        </Drawer>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsDrawer)