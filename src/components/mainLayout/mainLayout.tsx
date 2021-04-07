import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TimeProfile from '../timeProfile/timeProfile';
import ActuatorPlacement from "@/components/actuatorsPlacement/actuatorsPlacement";
import clsx from 'clsx';
import { Alert } from "@material-ui/lab";
import { Snackbar } from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        // flexGrow: 1,
        width: '100%',
        height: '100%',
    },
    fullHeight: {
        'min-height': '100%',
        maxHeight: 600,
    },
    hide: {
        display: 'none'
    }
}));

export default function MainLayout(props: { active: boolean, slotNb: number, tactonSaved: boolean, cancelMessage: () => void }) {
    const classes = useStyles();

    return (
        // <div className={classes.root} hidden={!props.active}>
        <div className={clsx(classes.root, !props.active ? classes.hide : '')}>
            <Grid container spacing={0} className={classes.root}>
                <Grid container item xs={6} className={classes.fullHeight}>
                    <TimeProfile />
                </Grid>
                <Grid container item xs={6} className={classes.fullHeight}>
                    <ActuatorPlacement />
                </Grid>
                <Snackbar open={props.tactonSaved} autoHideDuration={3000} onClose={() => props.cancelMessage()}>
                    <Alert severity="success" onClose={() => props.cancelMessage()}>
                        Tacton successfully uploaded!
                            </Alert>
                </Snackbar>
            </Grid>
        </div>)
}
