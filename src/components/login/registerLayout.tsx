import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

interface registerInterface {
    onClickRegister: any,
    onClickLoginPage: any
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
            height: '60px'
        }
    }),
);

const RegisterLayout = ({ onClickRegister, onClickLoginPage }: registerInterface) => {
    const classes = useStyles();

    return (
        <Grid container justify="center" spacing={3} className={classes.root}>
            <Grid item xs={2} />
            <Grid container item xs={8} justify="center" alignItems="center" spacing={2}>
                <Grid item xs={12} className={classes.flexStyle}>
                    <Typography variant="h3" display="inline">Register for the TactJam project</Typography>
                </Grid>
                <Grid item xs={12} className={classes.spacer} />
                <Grid item xs={12}>
                    <TextField
                        id="username"
                        label="Username"
                        fullWidth={true}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth={true}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="rep_password"
                        label="rep_Password"
                        type="password"
                        fullWidth={true}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="email"
                        label="Email"
                        fullWidth={true}
                    />
                </Grid>
                <Grid item xs={12} className={classes.spacer} />
                <Grid item xs={4} />
                <Grid item xs={4}>
                    <Button variant="outlined" onClick={() => onClickRegister()} fullWidth={true}>
                        Register
                        </Button>
                </Grid>
                <Grid item xs={4} />
                <Grid item xs={4} />
                <Grid item xs={4}>
                    <Button variant="outlined" onClick={() => onClickLoginPage()}>
                        Already have account? Login here.
                        </Button>
                </Grid>
                <Grid item xs={4} />
            </Grid>
        </Grid>
    )
};

export default RegisterLayout;
