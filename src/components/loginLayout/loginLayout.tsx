import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

interface connlayoutInterface {
    onClickSubmit: any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
        },
        button: {
            maxWidth: '80px',
        },
    }),
);

const LoginLayout = ({ onClickSubmit }: connlayoutInterface) => {
    const classes = useStyles();
    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [formError, setErrorForm] = React.useState({ userName: false, password: false });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //setErrorForm({ userName: true, password: false });
        onClickSubmit()
    };

    return (
        <Grid container spacing={0} >
            <Grid item xs={4} />
            <Grid item xs={4}>
                <h1>Welcome to TactJam</h1>
                <form className={classes.root} onSubmit={handleSubmit}>
                    <FormControl fullWidth={true}>
                        <TextField
                            id="userName"
                            label="UserName"
                            value={userName}
                            helperText={formError.userName ? 'This field is required' : ' '}
                            error={formError.userName}
                        />
                        <TextField
                            id="password"
                            label="Password"
                            value={password}
                            helperText={formError.password ? 'This field is required' : ' '}
                            error={formError.password}
                        />
                        <div className={classes.buttonContainer}>
                            <Button type="submit" variant="outlined" color="primary" className={classes.button}>
                                Login
                        </Button>
                        </div>
                    </FormControl>
                </form>
            </Grid>
            <Grid item xs={4} />
        </Grid>
    );
};

export default LoginLayout