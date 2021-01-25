import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ActuatorTimeProfile from './actuatorTimeProfile';
import { Grid, Button } from '@material-ui/core';
let VTP = require('vtp.js/dist/vtp.cjs');
import { ipcRenderer } from 'electron';
import tactons from './hardcodedTactons';

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
  }
}));


interface VTPInstruction {
    type: string,
    channelSelect: number,
    timeOffset: number,
    amplitude: number,
    frequency: number
};

interface tactonAttributes {
    duration: number,
    actuators: { [key: number]: { [key: string]: number }[] }
}


function hardcodedData(): tactonAttributes {
    const instructionWords = new Uint8Array([
        0x10, 0x00, 0x00, 0xEA, 0x20, 0x00, 0x00, 0x7B, 0x10, 0x20, 0x01, 0x59,
        0x10, 0x20, 0xC9, 0xC8, 0x10, 0x10, 0x03, 0x15, 0x00, 0x00, 0x07, 0xD0,
        0x20, 0x00, 0x00, 0xEA, 0x10, 0x20, 0x02, 0x37
    ]).buffer;

    const actuators: tactonAttributes["actuators"] = {};
    for(let i = 1; i <= 8; i++) { actuators[i] = []; }
    let currentTime = 0;
    //TODO use instruction words
    // VTP.readInstructionWords(instructionWords)
    tactons[0].map((el: object, i: number) => VTP.decodeInstruction(el))
        .map((instruction: VTPInstruction) => {
            currentTime += instruction.timeOffset;
            if(instruction.type == 'SetAmplitude') {
                if(instruction.channelSelect !== 0) {
                    actuators[instruction.channelSelect+1].push({ amplitude: instruction.amplitude, time: currentTime });
                }
                // channel = 0 means all actuators must change
                else {
                    Object.keys(actuators).forEach((key, i) => actuators[+key].push({ amplitude: instruction.amplitude, time: currentTime }));
                }
            }
        });

    return { duration: currentTime, actuators };
}

export default function TimeProfile() {
  const [ data, setData ] = React.useState<tactonAttributes>(hardcodedData);

  const classes = useStyles();

  //TODO implement sending tactons from the serial connection
  ipcRenderer.on('received_tacton', (event, args) => {
    //TODO parse args
    // setData(args.data);
  });

  return (
      <Grid container item direction="column" alignContent="center" justify="center">
        <Grid item xs={10} className={classes.fullWidth}>
          <svg id="time-profile" className={classes.svg}>
            {(() => {
              const colors = [ '#ab2056', '#5454ff', '#24ab24', '#9a9a9a', '#9a34ff', '#21abab','#ffff00', '#df8100' ];
              const startY = 30, stepY = 65;
              const res = colors.map((col: string, id) => {
                return <ActuatorTimeProfile key={'timeProfile-'+id} id={id+1}
                                            x={100} y={startY + stepY*id} width={400} height={60} color={col}
                                            duration={ data.duration } data={ data.actuators[id+1] }/>
              });
              return res;
            })()}
          </svg>
        </Grid>
        {/*<Grid item xs={1}>*/}
        {/*  <Button onClick={() => setData(hardcodedData())}>Change Data</Button>*/}
        {/*</Grid>*/}
      </Grid>
  )
}
