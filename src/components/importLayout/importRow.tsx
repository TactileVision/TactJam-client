import React from 'react';
import Grid from '@material-ui/core/Grid'
import { Tacton } from '../centralComponents/TactonContext'
import ImportCard from './importCard';

interface ImportRowInterface {
    firstTacton: Tacton,
    secondTacton: Tacton,
    onClickImport: (tacton:Tacton) => void
}

const ImportRow = ({ firstTacton, secondTacton, onClickImport }: ImportRowInterface) => {
    return (
        <Grid container >
            <Grid container justify="center">
                <Grid item xs={6}>
                    <ImportCard tacton={firstTacton} onClickImport={(tacton) => onClickImport(tacton)}/>
                </Grid>
                <Grid item xs={6}>
                    {secondTacton != null && <ImportCard tacton={secondTacton} onClickImport={(tacton) => onClickImport(tacton)} />}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ImportRow;
