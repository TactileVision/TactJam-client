import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import axios from "axios";

interface registerInterface {
    t: any
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
            height: '30px'
        }
    }),
);

const RegisterLayout = ({ t, onClickRegister, onClickLoginPage }: registerInterface) => {
    const classes = useStyles();
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [repPassword, setRepPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [errorForm, setErrorForm] = React.useState({
        required: {
            username: false,
            email: false,
            password: false,
            name: false,
        },
        usernameSize: false,
        passwordSize: false,
        passwordMatch: false,
        emailTaken: false,
        userNameTaken: false
    });

    //setErrors führen zum rerendern bitte nur einmal aufrufen
    const validateForm = (): boolean => {
        let returnValue: boolean = true;
        let tempError = {
            required: {
                username: false,
                email: false,
                password: false,
                name: false,
            },
            usernameSize: false,
            passwordSize: false,
            passwordMatch: false,
            emailTaken: false,
            userNameTaken: false
        }
        if (username === '') {
            returnValue = false;
            tempError = {
                ...tempError,
                required: {
                    ...tempError.required,
                    username: true,
                }
            }
        }
        if (username.length < 4) {
            returnValue = false;
            tempError = {
                ...tempError,
                usernameSize: true
            }
        }
        if (email === '') {
            returnValue = false;
            tempError = {
                ...tempError,
                required: {
                    ...tempError.required,
                    email: true,
                }
            }
        }
        if (password === '') {
            returnValue = false;
            tempError = {
                ...tempError,
                required: {
                    ...tempError.required,
                    password: true,
                }
            }
        }
        if (password === '') {
            returnValue = false;
            tempError = {
                ...tempError,
                required: {
                    ...tempError.required,
                    password: true,
                }
            }
        }
        if (password.length < 4 || password.length > 128) {
            returnValue = false;
            tempError = {
                ...tempError,
                passwordSize: true
            }
        }
        if (name === '') {
            returnValue = false;
            tempError = {
                ...tempError,
                required: {
                    ...tempError.required,
                    name: true,
                }
            }
        }
        if (password !== repPassword) {
            returnValue = false;
            tempError = {
                ...tempError,
                passwordMatch: true
            }
        }
        if (!returnValue)
            setErrorForm(tempError)

        return returnValue;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.id === 'username')
            setUsername(event.target.value);
        if (event.target.id === 'password')
            setPassword(event.target.value);
        if (event.target.id === 'rep_password')
            setRepPassword(event.target.value);
        if (event.target.id === 'email')
            setEmail(event.target.value);
        if (event.target.id === 'name')
            setName(event.target.value);
    };

    const register = () => {
        if (validateForm()) {
            axios
                .post("user/register", {
                    'username': username,
                    'email': email,
                    'password': password,
                    'password2': repPassword,
                    'name': name
                })
                .then((response) => {
                    console.log(response);
                    onClickRegister()
                })
                .catch((error) => {
                    let tempEmailTaken = false;
                    let tempUsernameTaken = false;
                    if (error.response?.data.includes('email')) {
                        tempEmailTaken = true
                    }
                    if (error.response?.data.includes('username')) {
                        tempUsernameTaken = true
                    }
                    if (tempEmailTaken || tempUsernameTaken) {
                        setErrorForm({
                            ...errorForm,
                            emailTaken: tempEmailTaken,
                            userNameTaken: tempUsernameTaken
                        })
                    }
                });
        }
    }

    const showCorrectHelper = (fieldID: string): string => {
        let helperText = t('other.unexpected');
        if (fieldID === 'username') {
            if (errorForm.userNameTaken)
                helperText = t('register.userNameTaken');
            if (errorForm.usernameSize)
                helperText = t('register.userNameSize');
            if (errorForm.required.username)
                helperText = t('other.fieldRequired');
            if (!errorForm.required.username && !errorForm.userNameTaken && !errorForm.usernameSize)
                helperText = "";
        }
        if (fieldID === 'email') {
            if (errorForm.required.email)
                helperText = t('other.fieldRequired');
            if (errorForm.emailTaken)
                helperText = t('register.emailTaken');
            if (!errorForm.required.email && !errorForm.emailTaken)
                helperText = "";
        }
        if (fieldID === 'password') {
            if (errorForm.required.password)
                helperText = t('other.fieldRequired');
            if (errorForm.passwordSize)
                helperText = t('register.passwordSize')
            if (!errorForm.required.password && !errorForm.passwordSize)
                helperText = "";
        }
        return helperText
    }
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
                        value={username}
                        onChange={handleChange}
                        helperText={showCorrectHelper('username')}
                        error={errorForm.required.username || errorForm.userNameTaken || errorForm.usernameSize}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth={true}
                        value={password}
                        onChange={handleChange}
                        helperText={showCorrectHelper('password')}
                        error={errorForm.required.password || errorForm.passwordSize}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="rep_password"
                        label="Confirm password"
                        type="password"
                        fullWidth={true}
                        value={repPassword}
                        onChange={handleChange}
                        helperText={errorForm.passwordMatch ? t('register.matchPassword') : ''}
                        error={errorForm.passwordMatch}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="email"
                        label="Email"
                        fullWidth={true}
                        value={email}
                        onChange={handleChange}
                        helperText={showCorrectHelper('email')}
                        error={errorForm.required.email || errorForm.emailTaken}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="name"
                        label="Name"
                        fullWidth={true}
                        value={name}
                        onChange={handleChange}
                        helperText={errorForm.required.name ? t('other.fieldRequired') : ''}
                        error={errorForm.required.name}
                    />
                </Grid>
                <Grid item xs={12} className={classes.spacer} />
                <Grid item xs={4} />
                <Grid item xs={4}>
                    <Button variant="outlined" onClick={() => register()} fullWidth={true}>
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
            <Grid item xs={2} />
        </Grid>
    )
};

export default withTranslation()(RegisterLayout);
