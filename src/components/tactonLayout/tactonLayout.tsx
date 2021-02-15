import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MainLayout from "@/components/mainLayout/mainLayout";
import ImportLayout from "@/components/importLayout/importLayout";
import SaveLayout from "@/components/saveLayout/saveLayout";
import { Layouts } from "../App";
import { TactonContext, TactonProvider } from '../centralComponents/TactonContext';
import { InformContext, InformProvided } from '../centralComponents/InformContext';

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
    slotNb: number,
    layout: Layouts,
    active: boolean,
    changeLayout: (layout: Layouts) => void,
};

export default function TactonLayout(props: TactonLayoutProps) {
    const classes = useStyles();
    const [tactonIsSaved, setTactonIsSaved] = React.useState(false)
    const saveTacton = () => {
        setTactonIsSaved(true)
        props.changeLayout(Layouts.MainLayout)
    }

    const cancelMessage = () =>{
        setTactonIsSaved(false)
    }
    //TODO add callbacks to handle tacton data
    return (
        <TactonProvider slotNb={props.slotNb}>
            <Grid item xs={12} hidden={!props.active}>
                <MainLayout active={props.layout === Layouts.MainLayout} slotNb={props.slotNb} tactonSaved={tactonIsSaved} cancelMessage={() =>  cancelMessage()}/>
                <ImportLayout active={props.layout === Layouts.ImportLayout} returnMainLayout={() => props.changeLayout(Layouts.MainLayout)} />
                <SaveLayout active={props.layout === Layouts.SaveLayout} returnToMainLayout={(tactonSaved) => saveTacton()} />
            </Grid>
        </TactonProvider>
    );
}
