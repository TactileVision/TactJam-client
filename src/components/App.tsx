import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MainLayout from './mainLayout/mainLayout'
import ImportLayout from './importLayout/importLayout'
import SaveLayout from './saveLayout/saveLayout';
import CustomTab from './Navbar/CustomTab';
import LoginLayout from './loginLayout/loginLayout';
import ElectronNavbar from './Navbar/electronNavbar';

export enum Layouts {
  MainLayout,
  SaveLayout,
  ImportLayout
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  tabs: {
    backgroundColor: "#3f51b5",
    minHeight: 40,
    textAlign: 'center',
  },
  middleTab: {
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
    borderBlockColor: 'black',
    backgroundColor: "#3f51b5",
    minHeight: 40,
    textAlign: 'center',
  }
}));


export default function NavTabs() {
  const classes = useStyles();
  const [isConnected, setIsConnected] = React.useState(false);
  const [activeSlot, setActiveSlot] = React.useState(1);
  const [currentLayout, setCurrentLayout] = React.useState(Layouts.MainLayout);

  const handleChange = (slotNumber: number, layout: Layouts) => {
    console.log(layout);
    setActiveSlot(slotNumber);
    setCurrentLayout(layout)
  };

  const tryLogin = () => {
    setIsConnected(true)
  }
  return isConnected ? (
    <Grid container spacing={0} className={classes.root}>
      <Grid item xs={12} >
        <ElectronNavbar />
      </Grid>
      <Grid item xs={4} className={classes.tabs}>
        <CustomTab
          onClickTab={(slotNumber: number, layout: Layouts) => handleChange(slotNumber, layout)}
          slotNumber={1}
        />
      </Grid>
      <Grid item xs={4} className={classes.middleTab}>
        <CustomTab
          onClickTab={(slotNumber: number, layout: Layouts) => handleChange(slotNumber, layout)}
          slotNumber={2}
        />
      </Grid>
      <Grid item xs={4} className={classes.tabs}>
        <CustomTab
          onClickTab={(slotNumber: number, layout: Layouts) => handleChange(slotNumber, layout)}
          slotNumber={3}
        />
      </Grid>
      <Grid item xs={12}>
        {currentLayout === Layouts.MainLayout && <MainLayout />}
        {currentLayout === Layouts.ImportLayout && <ImportLayout slotNumber={activeSlot} />}
        {currentLayout === Layouts.SaveLayout && <SaveLayout />}
      </Grid>
    </Grid>
  ) : (
      <div>
        <ElectronNavbar />
        <LoginLayout onClickSubmit={() => tryLogin()} />
      </div>
    );
}