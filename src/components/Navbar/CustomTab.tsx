import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Layouts } from '../App'

interface buttonInterface {
  onClickTab: any;
  slotNumber: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    textTransform: 'none',
    textAlign: 'center',
    color: 'white',
    minHeight: '100%',
  },
}));

const CustomTab = ({ onClickTab, slotNumber }: buttonInterface) => {
  const classes = useStyles();
  return (
    <Grid container spacing={0} >
      <Grid item xs={8}>
        <Button className={classes.button} fullWidth onClick={() => onClickTab(slotNumber, Layouts.MainLayout)}>
          Slot {slotNumber}
        </Button>
      </Grid>
      <Grid item xs={2}>
        <IconButton aria-label="import" onClick={() => onClickTab(slotNumber, Layouts.ImportLayout)}>
          <OpenInNewIcon style={{ color: "white" }} />
        </IconButton>
      </Grid>
      <Grid item xs={2}>
        <IconButton aria-label="save" onClick={() => onClickTab(slotNumber, Layouts.SaveLayout)}>
          <SaveIcon style={{ color: "white" }} />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default CustomTab