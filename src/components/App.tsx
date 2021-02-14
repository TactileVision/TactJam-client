import React, { useContext } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MainLayout from './mainLayout/mainLayout'
import ImportLayout from './importLayout/importLayout'
import SaveLayout from './saveLayout/saveLayout';
import CustomTab from './Navbar/CustomTab';
import RegisterLayout from './login/registerLayout';
import LoginLayout from './login/loginLayout';
import TactonLayout from './tactonLayout/tactonLayout';
import { InformContext } from './centralComponents/InformContext';

export enum Layouts {
  MainLayout,
  SaveLayout,
  ImportLayout
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // flexGrow: 1,
    width: '100%',
    //height: '100vh',
    overflow: 'inherit'
  },
  tabs: {
    height: 50,
    textAlign: 'center',
  }
}));


export default function NavTabs() {
  const classes = useStyles();
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);
  const [userHaveAccount, setUserHaveAccount] = React.useState(true);
  const [activeSlot, setActiveSlot] = React.useState(1);
  const [currentLayout, setCurrentLayout] = React.useState(Layouts.MainLayout);
  const { informProvidList, requestSave, saveRequested } = useContext(InformContext)

  const handleChange = (slotNumber: number, layout: Layouts) => {
    console.log(layout);
    console.log(informProvidList)
    if (layout == Layouts.SaveLayout) {
      if (informProvidList[slotNumber - 1].patternProvided && informProvidList[slotNumber - 1].positionProvided) {
        setActiveSlot(slotNumber);
        setCurrentLayout(layout)
      } else {
        if (!saveRequested[slotNumber - 1])
          requestSave(slotNumber)
      }
    } else {
      setActiveSlot(slotNumber);
      setCurrentLayout(layout)
    }
  };

  const tryLogin = () => {
    setUserLoggedIn(true)
  }

  const tryRegister = () => {
    setUserLoggedIn(true)
  }

  const goToRegisterPage = () => {
    setUserHaveAccount(false)
  }

  const goToLoginPage = () => {
    setUserHaveAccount(true)
  }

  const createTabs = () => {
    return Array(3).fill(null).map((el, i) => {
      return (
        <Grid item xs={4} className={classes.tabs} key={'tab' + i}>
          <CustomTab
            onClickTab={(slotNumber: number, layout: Layouts) => handleChange(slotNumber, layout)}
            slotNumber={i + 1}
            selected={activeSlot === i + 1}
          />
        </Grid>
      );
    })
  }

  return userLoggedIn ? (
    <Grid container spacing={0} className={classes.root}>
      { createTabs()}
      <TactonLayout slotNb={1} layout={currentLayout} active={activeSlot === 1} changeLayout={(layout: Layouts) => handleChange(1, layout)} />
      <TactonLayout slotNb={2} layout={currentLayout} active={activeSlot === 2} changeLayout={(layout: Layouts) => handleChange(2, layout)} />
      <TactonLayout slotNb={3} layout={currentLayout} active={activeSlot === 3} changeLayout={(layout: Layouts) => handleChange(3, layout)} />
    </Grid>
  ) : (
      <div className={classes.root}>
        {userLoggedIn == false && userHaveAccount == true && <LoginLayout onClickLogin={() => tryLogin()} onClickRegisterPage={() => goToRegisterPage()} />}
        {userLoggedIn == false && userHaveAccount == false && <RegisterLayout onClickRegister={() => tryRegister()} onClickLoginPage={() => goToLoginPage()} />}
      </div>
    );
}
