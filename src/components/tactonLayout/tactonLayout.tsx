import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MainLayout from "@/components/mainLayout/mainLayout";
import ImportLayout from "@/components/importLayout/importLayout";
import SaveLayout from "@/components/saveLayout/saveLayout";
import { Layouts } from "../App";

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

interface TactonLayoutProps {
    layout: Layouts,
    active: boolean,
    changeLayout: (layout: Layouts) => void,
};

export default function TactonLayout(props: TactonLayoutProps) {
  const classes = useStyles();

  //TODO add callbacks to handle tacton data

  return (
      <Grid item xs={12} hidden={!props.active}>
          <MainLayout active={props.layout === Layouts.MainLayout}/>
          <ImportLayout active={props.layout === Layouts.ImportLayout} cancel={() => props.changeLayout(Layouts.MainLayout)}/>
          <SaveLayout active={props.layout === Layouts.SaveLayout} cancel={() => props.changeLayout(Layouts.MainLayout)}/>
      </Grid>
  );
}
