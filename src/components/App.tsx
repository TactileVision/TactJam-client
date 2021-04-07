import React, { useContext } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CustomTab from './Navbar/CustomTab';
import RegisterLayout from './login/registerLayout';
import LoginLayout from './login/loginLayout';
import TactonLayout from './tactonLayout/tactonLayout';
import { useSnackbar } from 'notistack';

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
  const { closeSnackbar } = useSnackbar();
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);
  const [userHaveAccount, setUserHaveAccount] = React.useState(true);
  const [activeSlot, setActiveSlot] = React.useState(1);
  const [currentLayout, setCurrentLayout] = React.useState(Layouts.MainLayout);

  const handleChange = (slotNumber: number, layout: Layouts) => {
    setCurrentLayout(layout)
    if (slotNumber !== activeSlot) {
      setActiveSlot(slotNumber);
      closeSnackbar()
    }
  };

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
      <TactonLayout slotNb={1} layout={currentLayout} active={activeSlot === 1} switchLayout={(slot:number, layout: Layouts) => handleChange(slot, layout)} />
      <TactonLayout slotNb={2} layout={currentLayout} active={activeSlot === 2} switchLayout={(slot:number, layout: Layouts) => handleChange(slot, layout)} />
      <TactonLayout slotNb={3} layout={currentLayout} active={activeSlot === 3} switchLayout={(slot:number, layout: Layouts) => handleChange(slot, layout)} />
    </Grid>
  ) : (
    <div className={classes.root}>
      {userLoggedIn == false && userHaveAccount == true && <LoginLayout onClickLogin={() => setUserLoggedIn(true)} onClickRegisterPage={() => setUserHaveAccount(false)} />}
      {userLoggedIn == false && userHaveAccount == false && <RegisterLayout onClickRegister={() => setUserLoggedIn(true)} onClickLoginPage={() => setUserHaveAccount(true)} />}
    </div>
  );
}
