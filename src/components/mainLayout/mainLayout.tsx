import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TimeProfile from '../timeProfile/timeProfile';
import ActuatorPlacement from "@/components/actuatorsPlacement/actuatorsPlacement";
import BodyPlacement from './bodyPlacement';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        height: '95vh',
        overflow: 'hidden'
    },
    fullHeight: {
        'min-height': '100%',
    }
}));

export default function MainLayout() {
  const classes = useStyles();
  return (
    <Grid container spacing={0} className={classes.root}>
      <Grid container item xs={6} className={classes.fullHeight}> {/*style={{ borderRightStyle: 'solid', borderColor: 'black', borderWidth: '1em' }}>*/}
        <TimeProfile />
      </Grid>
      <Grid item xs={6}>
        <ActuatorPlacement />
      </Grid>
    </Grid>
  );
}
