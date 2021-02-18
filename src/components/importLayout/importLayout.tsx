import React, { useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List'
import ImportRow from './importRow'
import axios from 'axios'
import { TactonContext, Tacton } from '../centralComponents/TactonContext'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            overflow: 'scrollable'
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 150,
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        },
        noLabel: {
            marginTop: theme.spacing(3),
        },
        listLeft: {
            marginLeft: '10px'
        },
        listRight: {
            marginRight: '10px'
        },
        fixedButton: {
            position: 'fixed',
            bottom: 10,
        }
    }),
);

interface ImportLayoutProps {
    returnMainLayout: () => void,
}

// const ImportLayout = ({ slotNumber }: importLayoutInterface) => {
const ImportLayout = (props: ImportLayoutProps) => {
    const classes = useStyles();
    const { setTacton } = useContext(TactonContext);
    const [personName, setPersonName] = React.useState<string[]>([]);
    const [tactonList, setTactonList] = React.useState<Tacton[]>([]);

    async function getTactonMeta() {
        const res = await axios.get('tactons')
        setTactonList(res.data);
    }
    useEffect(() => {
        getTactonMeta();
    }, []);


    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPersonName(event.target.value as string[]);
    };

    const importClicked = (tacton: Tacton) => {
       // console.log('iclicked')
       // console.log(tacton);
        setTacton(tacton);
        props.returnMainLayout();
    };

    const tactonRow = (value: Tacton, index: number) => {
        if (index % 2 == 0) {
            if (index + 1 < tactonList.length) {
                return <ImportRow key={tactonList[index].id} firstTacton={tactonList[index]} secondTacton={tactonList[index + 1]} onClickImport={(tacton) => importClicked(tacton)} />
            } else {
                return <ImportRow key={tactonList[index].id} firstTacton={tactonList[index]} secondTacton={null} onClickImport={(tacton) => importClicked(tacton)} />
            }
        } else {
            return null
        }
    }
    return (
        // <Grid container spacing={3} hidden={!props.active}>
        <Grid container className={classes.root} style={{ marginBottom: 40 }}>
            <Grid container>
                <Grid item xs={12}>
                    <List className={classes.listLeft}>
                        {tactonList?.map((value, index) => (
                            tactonRow(value, index)
                        ))}
                    </List>
                </Grid>
            </Grid>
            <Grid item container xs={12} justify="center" alignContent="center" className={classes.fixedButton}>
                <Grid item>
                    <Button variant="contained"
                        onClick={() => props.returnMainLayout()}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ImportLayout;
