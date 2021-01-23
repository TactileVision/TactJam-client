import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Grid, { GridSpacing } from '@material-ui/core/Grid'
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ImportCard from './importCard'

// interface importLayoutInterface {
//     slotNumber: number;
// }

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
        hide: {
            display: 'none'
        },
        listLeft: {
            marginLeft: '10px'
        },
        listRight: {
            marginRight: '10px'
        }
    }),
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

const tactJamPatterns = [
    { id: 1, title: "test", tags: ["body", "head"] },
    { id: 2, title: "im a pattern", tags: ["body", "leg"] },
    { id: 3, title: "test", tags: ["body", "head"] },
];


interface ImportLayoutProps {
    active: boolean,
    cancel: () => void,
}

// const ImportLayout = ({ slotNumber }: importLayoutInterface) => {
const ImportLayout = (props: ImportLayoutProps) => {
    const classes = useStyles();
    const [personName, setPersonName] = React.useState<string[]>([]);
    const [firstPatterns, setFirstPatterns] = React.useState<{ id: number; title: string; tags: string[]; }[]>();
    const [secondPatterns, setSecondPatterns] = React.useState<{ id: number; title: string; tags: string[]; }[]>();

    useEffect(() => {
        var tempOne: { id: number; title: string; tags: string[] }[] = [];
        tempOne.push(tactJamPatterns[0]);
        tempOne.push(tactJamPatterns[1]);
        var tempTwo: { id: number; title: string; tags: string[] }[] = [];
        tempTwo.push(tactJamPatterns[2]);
        setFirstPatterns(tempOne)
        setSecondPatterns(tempTwo)
    }, []);


    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPersonName(event.target.value as string[]);
    };

    return (
        // <Grid container spacing={3} hidden={!props.active}>
        <Grid container className={!props.active ? classes.hide : ""}>
            <Grid container justify="center">
                <Grid item xs={6}>
                    <FormControl className={classes.formControl} fullWidth={true}>
                        <InputLabel id="tags">Select your Tags</InputLabel>
                        <Select
                            labelId="tags"
                            id="tags"
                            multiple
                            value={personName}
                            onChange={handleChange}
                            input={<Input />}
                            renderValue={(selected) => (selected as string[]).join(', ')}
                            MenuProps={MenuProps}
                        >
                            {names.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={personName.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <List className={classes.listLeft}>
                        {firstPatterns?.map((value, index) => (
                            <ImportCard key={value.id.toString()} patternID={value.id} title={value.title} tags={value.tags} />
                        ))}
                    </List>
                </Grid>
                <Grid item xs={12} md={6} >
                    <List className={classes.listRight}>
                        {secondPatterns?.map(pattern => (
                            <ImportCard key={pattern.id.toString()} patternID={pattern.id} title={pattern.title} tags={pattern.tags} />
                        ))}
                    </List>
                </Grid>
            </Grid>
            <Grid item container xs={12} justify="center" alignContent="center" style={{ marginTop: 60 }}>
                <Grid item>
                    <Button variant="contained"
                        onClick={() => props.cancel()}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ImportLayout;
