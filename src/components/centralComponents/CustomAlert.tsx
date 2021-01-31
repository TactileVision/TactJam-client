import React, { useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { Color } from '@material-ui/lab/Alert';
import { Collapse } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { withTranslation } from 'react-i18next';

interface alertInterface {
    t: any,
    showAlert: boolean,
    notifyParentCancel: any,
    message: string,
    severity: Color,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        alertStyle: {
            position: "fixed",
            bottom: 0,
            width: "-webkit-fill-available",  /* Mozilla-based browsers will ignore this. */
        }
    }),
);

const CustomAlert = ({ t, showAlert, notifyParentCancel, message, severity,  }: alertInterface) => {
    const classes = useStyles();

    return (<Collapse in={showAlert}>
        <Alert
            className={classes.alertStyle}
            severity={severity}
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        notifyParentCancel();
                    }}
                >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            }
        >
            {t(message)}
        </Alert>
    </Collapse>)
}

export default withTranslation()(CustomAlert)