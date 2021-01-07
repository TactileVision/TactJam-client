import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { Layouts } from '../App'
import { remote } from 'electron';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: '#002884'
    },
    button: {
        maxHeight: '10px'
    },
}));

const ElectronNavbar = () => {
    const classes = useStyles();

    const closeWindow = () => {
        console.log("onfire")
        let w = remote.getCurrentWindow()
        w.close()
    }

    return (
        <Grid container justify="flex-end" className={classes.root}>
            <IconButton aria-label="close" color="primary" onClick={() => closeWindow()} className={classes.button}>
                <CloseOutlined />
            </IconButton>
        </Grid>
    );
};

export default ElectronNavbar