import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default function MainLayout() {
  const classes = useStyles();
  return (
    <div>
        Body Placements
    </div>
  );
}