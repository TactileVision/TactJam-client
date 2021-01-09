import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ActuatorTimeProfile from './actuatorTimeProfile';
import { Grid, Button } from '@material-ui/core';

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

function randData(length: number): number[] {
  let data = [];
  for(let i = 0; i < length; i++) { data.push(Math.random()); }
  return data;
}

// class TimeProfile extends React.Component {
//   constructor(props: object) {
//     super(props);
//     this.state = {
//       data: Array(3).fill(null)
//     }
//   }
//
//   changeData() {
//     this.setState({ data: [ randData(25), randData(25), randData(25) ] });
//   }


export default function TimeProfile() {
  const [ data, setData ]: [ number[][], any ] = React.useState(Array(8).fill(null));

  const classes = useStyles();

  return (
      <Grid container item direction="column" alignContent="center" justify="center">
        <Grid item xs={10} className={classes.fullWidth}>
          <svg id="time-profile" className={classes.svg}>
            {(() => {
              const colors = [ '#ab2056', '#5454ff', '#24ab24', '#9a9a9a', '#9a34ff', '#21abab','#ffff00', '#df8100' ];
              const startY = 30, stepY = 65;
              const res = colors.map((col: string, id) => {
                return <ActuatorTimeProfile key={'timeProfile-'+id} id={id+1} x={100} y={startY + stepY*id} width={400} height={60} color={col} data={data[id]}/>
              });
              return res;
            })()}
            
            {/*<ActuatorTimeProfile id={1} x={50} y={25} width={250} height={150} color="red" data={data[0]}/>*/}
            {/*<ActuatorTimeProfile id={2} x={50} y={100} width={250} height={150} color="blue" data={data[1]}/>*/}
            {/*<ActuatorTimeProfile id={3} x={50} y={350} width={250} height={150} color="green" data={data[2]}/>*/}
          </svg>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={() => setData(Array(8).fill(randData(25)))}>Change Data</Button>
        </Grid>
      </Grid>
  )
}


// export default function MainLayout() {
//   const classes = useStyles();
//   return (
//     <div>
//         Strength Pattern
//     </div>
//   );
// }
