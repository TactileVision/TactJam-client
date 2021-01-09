import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TimeProfile from '../timeProfile/timeProfile';
import ActuatorPlacement from "@/components/actuatorsPlacement/actuatorsPlacement";
import ConnectionPanel from "@/components/deviceConnection/connectionPanel";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        // flexGrow: 1,
        width: '100%',
        height: '100%',
    },
    fullHeight: {
        'min-height': '100%',
    }
}));

export default function MainLayout() {
  const classes = useStyles();
  return (
      <div className={classes.root}>
        <Grid container spacing={0} className={classes.root}>
            <Grid container item xs={6} className={classes.fullHeight}> {/*style={{ borderRightStyle: 'solid', borderColor: 'black', borderWidth: '1em' }}>*/}
                <TimeProfile />
            </Grid>
            <Grid item xs={6}>
                <ActuatorPlacement />
            </Grid>
        </Grid>
        <ConnectionPanel/>
      </div>
  );
}
