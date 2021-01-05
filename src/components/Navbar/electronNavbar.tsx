import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { Layouts } from '../App'
import { remote } from 'electron';

interface buttonInterface {
    onClickTab: any;
    slotNumber: number;
}

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        textTransform: 'none',
        textAlign: 'center',
        color: 'white',
        minHeight: '100%',
    },
}));

const ElectronNavbar = () => {
    const closeWindow = () => {
        console.log("onfire")
        let w = remote.getCurrentWindow()
        w.close()
    }

    return (
        <Grid container spacing={0} >
            <Grid item xs={12}>
                <IconButton aria-label="close" onClick={() => closeWindow()}>
                    <CloseOutlined />
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default ElectronNavbar