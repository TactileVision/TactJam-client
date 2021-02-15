import React, { useContext } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ActuatorTimeProfile from './actuatorTimeProfile';
import { Grid, Button } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import { TactonContext } from '../centralComponents/TactonContext'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  fullWidth: {
    'min-width': '100%'
  },
  svg: {
    width: '100%',
    height: '100%',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14'
  }
}));

export default function TimeProfile() {
  const classes = useStyles();

  //TODO implement sending tactons from the serial connection
  //taken care off in the TactonContext scope
  // ipcRenderer.on('tacton_received', (event, args) => {
  //   //TODO parse args
  //   // setData(args.data);
  //   console.log("time profile ok")
  // });

  const formatDuration = (duration: number) => {
    let ms = (duration % 1000) + ""
    ms = ms.substring(0, 2)
    return Math.floor(duration / 1000) + "." + ms + "s"
  }

  return (
    <TactonContext.Consumer>
      {({ encodedTacton, setTactonDemo }) => (
        < Grid container item direction="column" alignContent="center" justify="center">
          <Grid item xs={10} className={classes.fullWidth}>
            <svg id="time-profile" className={classes.svg}>
              {(() => {
                const colors = ['#ab2056', '#5454ff', '#24ab24', '#9a9a9a', '#9a34ff', '#21abab', '#ffff00', '#df8100'];
                const startY = 30, stepY = 65;
                const res = colors.map((col: string, id) => {
                  return <ActuatorTimeProfile key={'timeProfile-' + id} id={id + 1}
                    x={100} y={startY + stepY * id} width={400} height={60} color={col}
                    duration={encodedTacton ? encodedTacton.duration : 0}
                    data={encodedTacton ? encodedTacton.actuators[id + 1] : null} />
                });
                return res;
              })()}
              <text className="timeProfile-duration" x={420} y={550}>Duration: {encodedTacton ? formatDuration(encodedTacton.duration) : 0}</text>
            </svg>
          </Grid>
          {<Button onClick={() => setTactonDemo()}>Change Data</Button>}
        </Grid>
      )
      }
    </TactonContext.Consumer >
  )
}
