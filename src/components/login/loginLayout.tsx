import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Grid, Typography, Collapse } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import axios from "axios";
import CustomAlert from '../centralComponents/CustomAlert'


interface loginInterface {
    t: any,
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
        passwordButton: {
            textTransform: "none",
            color: "blue",
            padding: 0
        },
        test: {
            position: "fixed",
            bottom: 0,
            width: "-webkit-fill-available",  /* Mozilla-based browsers will ignore this. */
        }
    }),
);

const LoginLayout = ({ t, onClickLogin, onClickRegisterPage }: loginInterface) => {
    const classes = useStyles();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorForm, setErrorForm] = React.useState({
        required: {
            username: false,
            password: false,
        },
        falseCredentials: false
    });

    /**
     * check if username and the password are not empty
     * set the errors which occur at the form validation
     * return true if the username and the password are not empty
     * */
    const validateForm = (): boolean => {
        let userNameEmpty: boolean = (username === '');
        let passwordEmpty: boolean = (password === '');
        if (userNameEmpty != errorForm.required.username || passwordEmpty != errorForm.required.password) {
            setErrorForm({
                ...errorForm,
                required: {
                    username: userNameEmpty,
                    password: passwordEmpty,
                }
            })
        }
        return (!userNameEmpty && !passwordEmpty);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.id === 'username')
            setUsername(event.target.value);
        if (event.target.id === 'password')
            setPassword(event.target.value);
    };

    const login = () => {
        if (validateForm()) {
            axios
                .post("auth/login", {
                    'login': username,
                    'password': password
                })
                .then((response) => {
                    console.log(response);
                    onClickLogin()
                })
                .catch((error) => {
                    if (error.response?.data.includes('Invalid length of login or password') || error.response?.data.includes('Invalid combination of login and password')) {
                        setErrorForm({
                            required: {
                                username: false,
                                password: false,
                            },
                            falseCredentials: true,
                        })
                    } else {
                        console.log("something go wrong");
                        console.log(error)
                    }
                });
        } else {
            console.log("validation was false")
        }
    }

    return (
        <Grid container justify="center" spacing={0} className={classes.root}>
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
                        value={username}
                        onChange={handleChange}
                        helperText={errorForm.required.username ? t('other.fieldRequired') : ''}
                        error={errorForm.required.username}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="password"
                        label="password"
                        type="password"
                        fullWidth={true}
                        value={password}
                        onChange={handleChange}
                        helperText={errorForm.required.password ? t('other.fieldRequired') : ''}
                        error={errorForm.required.password}
                    />
                </Grid>
                {errorForm.falseCredentials && false &&
                    <Grid item xs={12}>
                        <Button size="small" className={classes.passwordButton}>
                            {t('login.forgetCredentials')}
                        </Button>
                    </Grid>}
                <Grid item xs={12} className={classes.spacer} />
                <Grid item xs={4} />
                <Grid item xs={4}>
                    <Button variant="outlined" onClick={() => login()} fullWidth={true}>
                        Login
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
            <Grid item xs={2} />
            <Grid item xs={12}>
                <CustomAlert
                    showAlert={errorForm.falseCredentials}
                    notifyParentCancel={() => setErrorForm({
                        ...errorForm,
                        falseCredentials: false
                    })}
                    message='login.invalidCredentials'
                    severity='error' />
            </Grid>
        </Grid>
    )
};

export default withTranslation()(LoginLayout);
