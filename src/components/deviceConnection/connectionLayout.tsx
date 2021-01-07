import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

interface connlayoutInterface {
    onClickRefresh: any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        // button: {
        //     margin: theme.spacing(1),
        // },
        // container: {
        //     position: 'relative',
        // },
        // verticalCenter: {
        //     margin: 0,
        //     position: 'absolute',
        //     top: '50%',
        // },
        root: {
            flexGrow: 1,
            height: '100vh',
        },
        fullH: {
            height: '100%'
        },
    }),
);

const ConnectionLayout = ({ onClickRefresh }: connlayoutInterface) => {
    const classes = useStyles();
    // return (
    //     <div className={classes.container}>
    //         <div className={classes.verticalCenter}>
    //             <Button
    //                 variant="contained"
    //                 color="primary"
    //                 size="medium"
    //                 className={classes.button}
    //                 startIcon={<SaveIcon />}
    //                 onClick={() => onClickRefresh()}
    //             >
    //                 Click here to search for a device
    //             </Button>
    //         </div>
    //     </div>
    //
    // );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // setError(true);
    };

    return (
        // <Grid container justify="center" spacing={2} alignItems="stretch" className={classes.fullScreen}>
        //     <Grid item xs={8}>
        //         <Grid container direction="column" justify="center" alignContent="center" spacing={6}>
        //             <Typography variant="h2" display="inline">Welcome to TactJam!</Typography>
        //             <Grid item xs={8}>
        //                 <Grid container direction="column" spacing={2}>
        //                     <Grid item>
        //                         <TextField
        //                             id="username"
        //                             label="Username"
        //                             fullWidth={true}
        //                         />
        //                     </Grid>
        //                     <Grid item xs>
        //                         <TextField
        //                             id="password"
        //                             label="Password"
        //                             type="password"
        //                             fullWidth={true}
        //                         />
        //                     </Grid>
        //                 </Grid>
        //             </Grid>
        //             <Grid item xs={2}>
        //                 <Button variant="contained">Connect</Button>
        //             </Grid>
        //         </Grid>
        //     </Grid>
        // </Grid>
        <Grid container direction="column" alignContent="center" className={classes.root}>
            <Grid container direction="column" alignContent="center" alignItems="center" className={classes.fullH} spacing={3} xs={12}>
                <Grid container item xs justify="center" alignItems="center">
                    <Grid item>
                        <Typography variant="h2" display="inline">Welcome to TactJam</Typography>
                    </Grid>
                </Grid>
                <Grid container item spacing={1} direction="column" justify="center" xs={5}>
                    <Grid item>
                        <TextField
                            id="username"
                            label="username"
                            fullWidth={true}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="password"
                            label="password"
                            type="password"
                            fullWidth={true}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="outlined" onClick={() => onClickRefresh()}>
                        Connection
                    </Button>
                </Grid>
                <Grid item xs={2}/>
            </Grid>
        </Grid>
    )
};

export default ConnectionLayout
