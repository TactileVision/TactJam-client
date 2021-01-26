import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

interface loginInterface {
    onClickLogin: any,
    onClickRegisterPage: any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fullH: {
            height: '100%'
        },
        root: {
            flexGrow: 1,
        },
        flexStyle: {
            marginTop: "8px",
            flex: "initial"
        },
        spacer: {
            height: '100px'
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: 60
        },
    }),
);

const LoginLayout = ({ onClickLogin, onClickRegisterPage }: loginInterface) => {
    const classes = useStyles();

    return (
        <Grid container justify="center" spacing={3} className={classes.root}>
            <Grid item xs={2} />
            <Grid container item xs={8} justify="center" alignItems="center" spacing={3}>
                <Grid item xs={12} className={classes.flexStyle}>
                    <Typography variant="h2" display="inline">Welcome to TactJam</Typography>
                </Grid>
                <Grid item xs={12} className={classes.spacer} />
                <Grid item xs={12}>
                    <TextField
                        id="username"
                        label="username"
                        fullWidth={true}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="password"
                        label="password"
                        type="password"
                        fullWidth={true}
                    />
                </Grid>
                <Grid item xs={12} className={classes.spacer} />
                <Grid item xs={4} />
                <Grid item xs={4}>
                    <Button variant="outlined" onClick={() => onClickLogin()} fullWidth={true}>
                        Connection
                        </Button>
                </Grid>
                <Grid item xs={4} />
                <Grid item xs={4} />
                <Grid item xs={4}>
                    <Button variant="outlined" onClick={() => onClickRegisterPage()}>
                        No user? Register here.
                        </Button>
                </Grid>
                <Grid item xs={4} />
            </Grid>
        </Grid>
    )
};

export default LoginLayout;
