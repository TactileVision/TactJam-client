import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TimeProfile from '../timeProfile/timeProfile';
import ActuatorPlacement from "@/components/actuatorsPlacement/actuatorsPlacement";
import clsx from 'clsx';
import { Alert } from "@material-ui/lab";
import { Snackbar } from "@material-ui/core";
import { ipcRenderer } from 'electron';
import { TactonContext } from '../centralComponents/TactonContext'

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

export default function MainLayout(props: { active: boolean, tactonSaved: boolean, cancelMessage: () => void }) {
    const classes = useStyles();
    const { slotNb, rawTacton, setPattern } = React.useContext(TactonContext)

    const equalBuffer = (buf1: ArrayBuffer) => {
        if (rawTacton == null) return false
        if (buf1.byteLength != rawTacton.byteLength) return false;
        var dv1 = new Int8Array(buf1);
        var dv2 = new Int8Array(rawTacton);
        for (var i = 0; i != buf1.byteLength; i++) {
            if (dv1[i] != dv2[i]) return false;
        }
        return true;
    }

    // update tacton's data when device sends one
    ipcRenderer.on('setTacton', (event, args: { slot: number, byteArray: ArrayBuffer }) => {
        // update tacton information if this slot is the one targeted
        if (args.byteArray !== null) {
            if (args.slot === slotNb) {
               // console.log("equalBuffer " + equalBuffer(args.byteArray))
                if (!equalBuffer(args.byteArray)) {
                    console.log("setting tacton on slot #" + args.slot, args.byteArray);
                    setPattern(args.byteArray)
                }
            }
        }
    });

    // does not work when placed in the "useEffect", not sure why...
    ipcRenderer.on('getTacton', (event, slot: number) => {
        // update tacton information if this slot is the one targeted
        if (slot === slotNb) {
            if (rawTacton !== null) {
                console.log("getting tacton from slot #" + slot);
                ipcRenderer.send('sendTactonToDevice', { slot: slot, byteArray: rawTacton });
            }
        }
    })

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
