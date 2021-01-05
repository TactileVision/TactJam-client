import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import StrengthPattern from './strengthPattern';
import BodyPlacement from './bodyPlacement';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default function MainLayout() {
  const classes = useStyles();
  return (
    <Grid container spacing={0} className={classes.root}>
      <Grid item xs={6} style={{ borderRightStyle: 'solid', borderColor: 'black', borderWidth: '1em' }}>
        <StrengthPattern />
      </Grid>
      <Grid item xs={6}>
        <BodyPlacement />
      </Grid>
    </Grid>
  );
}