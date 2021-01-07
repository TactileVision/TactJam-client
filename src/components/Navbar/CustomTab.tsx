import React from 'react';
import {makeStyles, MuiThemeProvider, createMuiTheme, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import blue from '@material-ui/core/colors/blue';
import { Layouts } from '../App'

interface buttonInterface {
  onClickTab: any;
  slotNumber: number;
  selected: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        textTransform: 'none',
        textAlign: 'center',
        // color: 'white',
        color: 'inherit',
        minHeight: '100%',
        border: 'none',
        '&$disabled': {
            color: '#4791db',
        },
    },
    disabled: {},
    icon: {
        padding: 'none',
        color: 'inherit !important'
    },
    passive: {
        color: '#00000061',
        'border-bottom': 'solid 1px #00000061',
        'min-height': '100%',
    },
    active: {
        color: '#4791db',
        'border-bottom': 'solid 2px #4791db',
        'box-sizing': 'border-box',
    }
}));


const CustomTab = ({ onClickTab, slotNumber, selected }: buttonInterface) => {
  const classes = useStyles();

  return (
      !selected ? (
          <Grid container spacing={0} className={selected ? classes.active : classes.passive}>
              <Grid item xs={12}>
                <Button className={classes.button} fullWidth onClick={() => onClickTab(slotNumber, Layouts.MainLayout)}>
                  Slot {slotNumber}
                </Button>
              </Grid>
          </Grid>
        ) : (
          <Grid container spacing={0} className={selected ? classes.active : classes.passive}>
              <Grid item xs={9}>
                  <Button classes={{root: classes.button, disabled: classes.disabled}} fullWidth disabled onClick={() => onClickTab(slotNumber, Layouts.MainLayout)}>
                      Slot {slotNumber}
                  </Button>
              </Grid>
              <Grid item>
                <IconButton aria-label="import" className={classes.icon} onClick={() => onClickTab(slotNumber, Layouts.ImportLayout)}>
                  <OpenInNewIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton aria-label="save" className={classes.icon} onClick={() => onClickTab(slotNumber, Layouts.SaveLayout)}>
                  <SaveIcon />
                </IconButton>
              </Grid>
          </Grid>
          )
  );
};

export default CustomTab
