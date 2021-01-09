import React from 'react';
import { IconButton, Drawer, Grid, Typography } from "@material-ui/core";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PublishIcon from '@material-ui/icons/Publish';
import {makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) => ({
    centeredButton: {
        position: 'fixed',
        bottom: 0,
        left: '47%',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        width: '80px',
        height: '48px',
        textAlign: 'center',
        fontSize: '44px',
        lineHeight: '44px',
        paddingLeft: '5px',
        boxShadow: '0 -2px 5px 0 #00000040',
    },
    connected: {
        color: '#4791db'
    },
    disconnected: {
        color: '#f44336'
    },
    vCentered: {
        'vertical-align': 'bottom',
    }
}));


function ConnectionPanel() {
    const classes = useStyles();

    const [opened, setOpened] = React.useState(false);
    const [connected, setConnected] = React.useState(false);
    
    const Content = () => {
        return (
            <Grid container direction="column" alignContent="center" alignItems="center">
                <Grid item>
                    <IconButton onClick={() => setOpened(false)}>
                        <ExpandMoreIcon/>
                    </IconButton>
                </Grid>
                <Grid container item justify="center" alignItems="center" spacing={1}>
                    <Grid item xs={2}>
                        <Typography variant="body1">
                            <FiberManualRecordIcon className={connected ? classes.connected : classes.disconnected} style={{ verticalAlign: 'bottom' }}/>
                            No device connected
                        </Typography>
                    </Grid>
                    <Grid item xs={2}/>
                    <Grid item xs={1}>
                        <IconButton>
                            <PublishIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    return(
        <div className={classes.centeredButton}>
            <FiberManualRecordIcon className={connected ? classes.connected : classes.disconnected}/>
            <IconButton aria-label="open connection panel" onClick={() => setOpened(true)}>
                <ExpandLessIcon />
            </IconButton>
            <Drawer id="drawer" anchor="bottom" open={opened} onClose={() => setOpened(false)}>
                <Content/>
            </Drawer>
        </div>
    );
}

export default ConnectionPanel;
