import React, { useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List'
import ImportRow from './importRow'
import axios from 'axios'
import { TactonContext, Tacton } from '../centralComponents/TactonContext'
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';

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
        },
        margin: {
            margin: theme.spacing(1),
        },
    }),
);

interface ImportLayoutProps {
    returnMainLayout: () => void,
}

// const ImportLayout = ({ slotNumber }: importLayoutInterface) => {
const ImportLayout = (props: ImportLayoutProps) => {
    const classes = useStyles();
    const { setTacton } = useContext(TactonContext);
    const [tactonList, setTactonList] = React.useState<Tacton[]>([]);
    const [searchPhrase, setSearchPhrase] = React.useState('');
    const [tactonDisplay, setTactonDisplay] = React.useState<Tacton[]>([]);

    async function getTactonMeta() {
        const res = await axios.get('tactons')
        setTactonList(res.data);
        setTactonDisplay(res.data)
    }
    useEffect(() => {
        getTactonMeta();
    }, []);

    const importClicked = (tacton: Tacton) => {
        // console.log('iclicked')
        // console.log(tacton);
        setTacton(tacton);
        props.returnMainLayout();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchPhrase(event.target.value);
    };

    const startSearch = () => {
        console.log(searchPhrase)
        const regex = /[a-z|A-Z|0-9|Ä|ä|Ö|ö|Ü|ü]+/g;
        const found: string[] = searchPhrase.match(regex);
        console.log(found);
        let tempTactonList: Tacton[] = [];
        if (found?.length > 0) {
            tactonList.forEach((tacton: Tacton) => {
                for (let i = 0; i < found.length; i++) {
                    //check if title is found in description or title
                    if (tacton.title.includes(found[i]) || tacton.description.includes(found[i])) {
                        tempTactonList.push(tacton);
                        break;
                    } else {
                        let correctTagFound = false;
                        //check if string is in tags
                        for (let y = 0; y < tacton.tags.length; y++) {
                            if (tacton.tags[y].name.includes(found[i])) {
                                tempTactonList.push(tacton);
                                correctTagFound = true;
                                break;
                            }
                        }
                        //string was in tags
                        if (correctTagFound)
                            break;

                        //check if string is in bodytags
                        for (let z = 0; z < tacton.bodytags.length; z++) {
                            if (tacton.bodytags[z].name.includes(found[i])) {
                                tempTactonList.push(tacton);
                                correctTagFound = true;
                                break;
                            }
                        }
                        //string was in bodytags
                        if (correctTagFound)
                            break;
                    }
                }
            })
            if (tempTactonList.length > 0) {
                setTactonDisplay(tempTactonList)
            }
        } else {
            if (tactonList.length > 0)
                setTactonDisplay(tactonList)
        }
    }

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            startSearch()
            // event.preventDefault();
        }
    }

    const tactonRow = (index: number) => {
        if (index % 2 == 0) {
            if (index + 1 < tactonDisplay.length) {
                return <ImportRow key={tactonDisplay[index].id} firstTacton={tactonDisplay[index]} secondTacton={tactonDisplay[index + 1]} onClickImport={(tacton) => importClicked(tacton)} />
            } else {
                return <ImportRow key={tactonDisplay[index].id} firstTacton={tactonDisplay[index]} secondTacton={null} onClickImport={(tacton) => importClicked(tacton)} />
            }
        } else {
            return null
        }
    }

    return (
        // <Grid container spacing={3} hidden={!props.active}>
        <Grid container className={classes.root} style={{ marginBottom: 40 }}>
            <Grid container>
                <Grid item xs={1} />
                <Grid item xs={10}>
                    <FormControl className={classes.margin} fullWidth={true}>
                        <InputLabel htmlFor="searchfield">Enter your search phrase</InputLabel>
                        <Input
                            id="searchfield"
                            value={searchPhrase}
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                            fullWidth={true}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={startSearch}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <List className={classes.listLeft}>
                        {tactonDisplay?.map((value, index) => (
                            tactonRow(index)
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
