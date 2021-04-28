import React, { Fragment, useEffect } from 'react';
import clsx from "clsx";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ipcRenderer } from 'electron';
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

interface ConnectionLineInterface {
    currentSlot: number,
    switchLayout: (arg0: number) => void
}

export default function ConnectionLine({ currentSlot, switchLayout }: ConnectionLineInterface) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const classes = useStyles();
    const [connected, setConnected] = React.useState(false)

    const switchSlot = (key: SnackbarKey, slot: number) => {
        closeSnackbar(key)
        switchLayout(slot)
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
    // ipcRenderer.removeAllListeners('deviceConnection');
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

    // update tacton's data when device sends one
    ipcRenderer.on('setTacton', (event, args: { slot: number, byteArray: ArrayBuffer }) => {
        // update tacton information if this slot is the one targeted
        if (args.byteArray !== null) {
            console.log("currentSlot " + currentSlot)
            console.log("send to slot " + args.slot)
            console.log("ist " + (args.slot === currentSlot))
            if (!(args.slot === currentSlot)) {
                enqueueSnackbar("You received a Tacton on another slot. Do you want to switch slots?", {
                    variant: 'success',
                    autoHideDuration: 5000,
                    action: (key) => actionRecievedTacton(key, args.slot),
                    preventDuplicate: true,
                })
            }
        }
    });

    ipcRenderer.on('getTacton', (event, slot: number) => {
        enqueueSnackbar("Send Tacton to the device.", {
            variant: 'success',
            autoHideDuration: 5000,
            action: actionOnlyClose,
            preventDuplicate: true,
        })
    })

    return (
        <div className={clsx(classes.connectionLine, connected ? classes.connected : classes.disconnected)} />
    );
}
