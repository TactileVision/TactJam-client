import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TimeProfile from '../timeProfile/timeProfile';
import ActuatorPlacement from "@/components/actuatorsPlacement/actuatorsPlacement";
import ConnectionLine from "@/components/deviceConnection/connectionLine";
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        // flexGrow: 1,
        width: '100%',
        height: '100%',
    },
    fullHeight: {
        'min-height': '100%',
        maxHeight: 720,
    },
    hide: {
        display: 'none'
    }
}));

export default function MainLayout(props: { active: boolean }) {
  const classes = useStyles();

  return (
      // <div className={classes.root} hidden={!props.active}>
      <div className={clsx(classes.root, !props.active ? classes.hide : '')}>
        <Grid container spacing={0} className={classes.root}>
            <Grid container item xs={6} className={classes.fullHeight}> {/*style={{ borderRightStyle: 'solid', borderColor: 'black', borderWidth: '1em' }}>*/}
                <TimeProfile />
            </Grid>
            <Grid container item xs={6} className={classes.fullHeight}>
                <ActuatorPlacement />
            </Grid>
        </Grid>
        <ConnectionLine/>
      </div>
  );
}
