import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MainLayout from './mainLayout/mainLayout'
import ImportLayout from './importLayout/importLayout'
import SaveLayout from './saveLayout/saveLayout';
import CustomTab from './Navbar/CustomTab';
import ElectronNavbar from './Navbar/electronNavbar';
import LoginLayout from './login/loginLayout';
import TactonLayout from './tactonLayout/tactonLayout';

export enum Layouts {
  MainLayout,
  SaveLayout,
  ImportLayout
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // flexGrow: 1,
    width: '100%',
    height: '100vh',
      overflow: 'hidden'
  },
  tabs: {
    height: 50,
    textAlign: 'center',
  }
}));


export default function NavTabs() {
  const classes = useStyles();
  const [devConnected, setDevConnected] = React.useState(false);
  const [activeSlot, setActiveSlot] = React.useState(1);
  const [currentLayout, setCurrentLayout] = React.useState(Layouts.MainLayout);

  const handleChange = (slotNumber: number, layout: Layouts) => {
    console.log(layout);
    setActiveSlot(slotNumber);
    setCurrentLayout(layout)
  };

  const tryReconnectDev = () => {
    setDevConnected(true)
  }

  const createTabs = () => {
    return Array(3).fill(null).map((el, i) => {
      return (
          <Grid item xs={4} className={classes.tabs} key={'tab'+i}>
            <CustomTab
                onClickTab={(slotNumber: number, layout: Layouts) => handleChange(slotNumber, layout)}
                slotNumber={i+1}
                selected={activeSlot === i+1}
            />
          </Grid>
      );
    })
  }

  return devConnected ? (
    <Grid container spacing={0} className={classes.root}>
      { createTabs() }
      <TactonLayout layout={currentLayout} active={activeSlot === 1}/>
      <TactonLayout layout={currentLayout} active={activeSlot === 2}/>
      <TactonLayout layout={currentLayout} active={activeSlot === 3}/>
    </Grid>
  ) : (
      <div className={classes.root}>
        {/*<ElectronNavbar />*/}
        <LoginLayout onClickRefresh={() => tryReconnectDev()} />
      </div>
    );
}
