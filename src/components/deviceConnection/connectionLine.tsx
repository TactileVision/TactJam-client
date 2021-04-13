import React, { Fragment } from 'react';
import clsx from "clsx";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ipcRenderer } from 'electron';
import { TactonContext } from "@/components/centralComponents/TactonContext";
import { useSnackbar, SnackbarKey } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles((theme: Theme) => ({
    connectionLine: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 5,
    },
    connected: {
        background: '#4791db'
    },
    disconnected: {
        background: '#f44336'
    },
}));


export default function ConnectionLine(props: { switchLayout: (slot: number) => void }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const classes = useStyles();
    const { slotNb, rawTacton, setPattern } = React.useContext(TactonContext)
    const [connected, setConnected] = React.useState(false)

    const switchSlot = (key: SnackbarKey, slot: number) => {
        closeSnackbar(key)
        props.switchLayout(slot)
    }

    const actionOnlyClose = (key: SnackbarKey) => (
        <Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => closeSnackbar(key)}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );
    const actionRecievedTacton = (key: SnackbarKey, slot: number) => (
        <Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => switchSlot(key, slot)}>
                <CheckIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => closeSnackbar(key)}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );


    // update view on device (dis)connection
    ipcRenderer.removeAllListeners('deviceConnection');
    ipcRenderer.on('deviceConnection', (event, newConnection) => {
        if (newConnection !== connected) {
            if (newConnection == true) {
                enqueueSnackbar("Device connected!", {
                    variant: 'success',
                    autoHideDuration: 3000,
                    preventDuplicate: true,
                    action: actionOnlyClose,
                });
            } else {
                enqueueSnackbar("Device disconnected!", {
                    variant: 'error',
                    autoHideDuration: 3000,
                    action: actionOnlyClose,
                    preventDuplicate: true,
                });
            }
            setConnected(newConnection);
        }
    });

    // retrieve tacton's data when device asks
    ipcRenderer.removeAllListeners('getTacton');
    ipcRenderer.on('getTacton', (event, slot: number) => {
        // update tacton information if this slot is the one targeted
        if (slot === slotNb) {
            if (rawTacton !== null) {
                console.log("getTacton")
                console.log(slotNb)
                console.log(rawTacton)
                console.log("getting tacton from slot #" + slot);
                ipcRenderer.send('sendTactonToDevice', { slot: slot, byteArray: rawTacton });
            }
        }
    })

    // update tacton's data when device sends one
    ipcRenderer.removeAllListeners('setTacton');
    ipcRenderer.on('setTacton', (event, args: { slot: number, byteArray: ArrayBuffer }) => {
        // update tacton information if this slot is the one targeted
        if (args.byteArray !== null) {
            if (args.slot === slotNb) {
                console.log("setting tacton on slot #" + args.slot, args.byteArray);
                setPattern(args.byteArray)
            } else {
                enqueueSnackbar("You recieved a Tacton. Do you want so switch the slot?", {
                    variant: 'success',
                    autoHideDuration: 5000,
                    action: (key) => actionRecievedTacton(key, args.slot),
                    preventDuplicate: true,
                })
            }
        }
    })


    return (
        <div className={clsx(classes.connectionLine, connected ? classes.connected : classes.disconnected)} />
    );
}
