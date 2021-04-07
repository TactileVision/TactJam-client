import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MainLayout from "@/components/mainLayout/mainLayout";
import ImportLayout from "@/components/importLayout/importLayout";
import SaveLayout from "@/components/saveLayout/saveLayout";
import { Layouts } from "../App";
import { TactonProvider } from '../centralComponents/TactonContext';
import ConnectionLine from "@/components/deviceConnection/connectionLine";

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
    switchLayout: (slot:number, layout: Layouts) => void,
};

export default function TactonLayout(props: TactonLayoutProps) {
    const classes = useStyles();
    const [tactonIsSaved, setTactonIsSaved] = React.useState(false)
    const saveTacton = (tactonSaved:boolean) => {
        setTactonIsSaved(tactonSaved)
        props.switchLayout(props.slotNb, Layouts.MainLayout)
    }

    const cancelMessage = () =>{
        setTactonIsSaved(false)
    }
    //TODO add callbacks to handle tacton data
    return (
        <TactonProvider slotNb={props.slotNb}>
            <Grid item xs={12} hidden={!props.active}>
                <MainLayout active={props.layout === Layouts.MainLayout} slotNb={props.slotNb} tactonSaved={tactonIsSaved} cancelMessage={() =>  cancelMessage()}/>
                {props.layout === Layouts.ImportLayout && <ImportLayout returnToMainLayout={() => props.switchLayout(props.slotNb, Layouts.MainLayout)} />}
                {props.layout === Layouts.SaveLayout && <SaveLayout returnToMainLayout={(tactonSaved) => saveTacton(tactonSaved)} />}
                <ConnectionLine switchLayout={(newSlot:number) => props.switchLayout(newSlot, Layouts.MainLayout)}/>
            </Grid>
        </TactonProvider>
    );
}
