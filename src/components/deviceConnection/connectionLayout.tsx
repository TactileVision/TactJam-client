import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

interface connlayoutInterface {
    onClickRefresh: any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
        container: {
            position: 'relative',
        },
        verticalCenter: {
            margin: 0,
            position: 'absolute',
            top: '50%',
        },
    }),
);

const ConnectionLayout = ({ onClickRefresh }: connlayoutInterface) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div className={classes.verticalCenter}>
                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    className={classes.button}
                    startIcon={<SaveIcon />}
                    onClick={() => onClickRefresh()}
                >
                    Click here to search for a device
      </Button>
            </div>
        </div>

    );
};

export default ConnectionLayout