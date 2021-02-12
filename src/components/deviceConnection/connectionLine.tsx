import React, { useEffect } from 'react';
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ipcRenderer } from 'electron';
import { TactonContext } from "@/components/centralComponents/TactonContext";
import clsx from "clsx";

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

enum AlertLevel {
    Nothing,
    Connection,
    Disconnection
}

function ConnectionPanel() {
    const classes = useStyles();

    const [connected, setConnected] = React.useState(false);
    const [alertLevel, displayAlert] = React.useState(AlertLevel.Nothing); // 0 - no alert, 1 - connection alert, 2 - error alert
    // update view on device (dis)connection
    ipcRenderer.on('deviceConnection', (event, connected) => {
        setConnected(connected);
        displayAlert(connected ? AlertLevel.Connection : AlertLevel.Disconnection);
    });

    // asks state of connection on first render
    useEffect(() => ipcRenderer.send('isDeviceConnected'), []);

    // send to server the tacton's data of this slot
    // function uploadTacton(slotNb: number, rawTacton: any) {
    //     if(rawTacton) ipcRenderer.send('sendingTacton', { slotNb: slotNb, rawData: rawTacton })
    //     else console.log("No tacton data to send to the device.")
    // }
    function closeAlert() {
        displayAlert(AlertLevel.Nothing)
    }

    return(
        <TactonContext.Consumer>
            {({slotNb, rawTacton}) => (
                <div className={clsx(classes.connectionLine, connected ? classes.connected : classes.disconnected)}>
                    <Snackbar open={alertLevel == AlertLevel.Connection} autoHideDuration={3000} onClose={closeAlert}>
                        <Alert severity="success" onClose={closeAlert}>
                            Device connected!
                        </Alert>
                    </Snackbar>
                    <Snackbar open={alertLevel == AlertLevel.Disconnection} autoHideDuration={3000} onClose={closeAlert}>
                        <Alert severity="error" onClose={closeAlert}>
                            Device disconnected!
                        </Alert>
                    </Snackbar>
                </div>
            )}
        </TactonContext.Consumer>
    );
}

export default ConnectionPanel;
