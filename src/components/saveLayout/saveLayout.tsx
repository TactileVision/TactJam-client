import React, { useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import SelectTwo from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Select from 'react-select'
import axios from 'axios'
import CreatableSelect from 'react-select/creatable';

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

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(1, 1, 0, 0),
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 60
    },
    formElement: {
        margin: '15px 0',
    },
    hide: {
        display: 'none'
    }
}));

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


interface SaveLayoutProps {
    active: boolean,
    cancel: () => void
}

export interface Selector {
    value: string,
    label: string,
}


export interface Tag {
    value: string,
    isNew: false
}

export type TagsList = Tag[]

const SaveLayout = (props: SaveLayoutProps) => {
    const classes = useStyles();
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [bodyParts, setBodyParts] = React.useState<string[]>([]);
    const [error, setError] = React.useState(false);
    const [selectCustomTag, setSelectCustomTag] = React.useState({
        inputValue: '',
        value: [] as Selector[],
        selectOptions: [] as Selector[],
    });
    const [selectBodyTag, setSelectBodyTag] = React.useState({
        selectOptions: [],
        tagsSelected: []
    });

    async function getCustomTag() {
        const res = await axios.get('tags')
        const data = res.data
        const options = data.map((d: any) => ({
            "value": d.id,
            "label": d.name
        }))
        setSelectCustomTag({ ...selectCustomTag, selectOptions: options })
    }

    async function getBodyTag() {
        const res = await axios.get('bodytags')
        const data = res.data
        const options = data.map((d: any) => ({
            "value": d.id,
            "label": d.name
        }))
        setSelectBodyTag({ ...selectBodyTag, selectOptions: options })
    }

    useEffect(() => {
        getCustomTag();
        getBodyTag()
    }, [])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(true);
    };

    const checkGoodString = (input: string): boolean => {
        let validString = true;
        if (!input || input.match(/^\s*$/) || input.match(/^;*$/) || input.match(/^,*$/) || input.match(/^#*$/))
            validString = false;
        return validString;
    }

    const createNewTags = (input: string): Selector[] => {
        let nextSpace: number = 0;
        let nextHash: number = 0;
        let nextSemicolon: number = 0;
        let nextComa: number = 0;
        let nextAt: number = 0;
        let tagArray = [] as Selector[];
        do {
            nextSpace = input.indexOf(' ');
            nextHash = input.indexOf('#');
            nextAt = input.indexOf('@');
            nextSemicolon = input.indexOf(';');
            nextComa = input.indexOf(',');
            //set Nextbreak to the next index of the breaking char
            let nextBreak: number = input.length;
            if (nextSpace < nextBreak && nextSpace !== -1)
                nextBreak = nextSpace;
            if (nextHash < nextBreak && nextHash !== -1)
                nextBreak = nextHash;
            if (nextSemicolon < nextBreak && nextSemicolon !== -1)
                nextBreak = nextSemicolon;
            if (nextComa < nextBreak && nextComa !== -1)
                nextBreak = nextComa;
            if (nextAt < nextBreak && nextAt !== -1)
                nextBreak = nextAt;

            if (nextBreak == 0 && input.length > 0) {
                //the first char of the string is a breaking point
                input = input.substring(1, input.length)
            } else {
                //there are a tag
                const newValueTag: string = input.substring(0, nextBreak);
                tagArray.push({
                    value: newValueTag,
                    label: newValueTag
                });
                if (input.length > nextBreak) {
                    //there are a nextBreak
                    input = input.substring(nextBreak + 1, input.length);
                }
            }
        } while (nextSpace >= 0 || nextHash >= 0 || nextSemicolon >= 0 || nextComa >= 0 || nextAt >= 0)
        return tagArray;
    }
    //set the values in the select box
    const handleChangeCustomTag = (inputValue: any, actionMeta: any) => {
        //new item selected
        if (actionMeta.action == 'create-option') {
            const lastItem: Selector = inputValue[inputValue.length - 1];
            //check if string is valid
            if (checkGoodString(lastItem.label)) {
                const newTags = createNewTags(lastItem.label);
                const tempOne: Selector[] = selectCustomTag.value.concat(newTags)
                const tempTwo: Selector[] = selectCustomTag.selectOptions.concat(newTags)
                setSelectCustomTag({
                    ...selectCustomTag,
                    inputValue: '',
                    value: tempOne,
                    selectOptions: tempTwo
                });
            }
        } else {
            setSelectCustomTag({
                ...selectCustomTag,
                inputValue: '',
                value: inputValue
            });
        }
    }

    const handleChangeBodyTag = (e: any) => {
        setSelectBodyTag({
            ...selectBodyTag,
            tagsSelected: e
        })
    };


    return (
        // <Grid container justify="center" spacing={3} hidden={!props.active}>
        <Grid container justify="center" spacing={3} className={!props.active ? classes.hide : ''}>
            <Grid item xs={2} />
            <Grid item xs={8}>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth={true}>
                        <TextField
                            id="title"
                            label="Title"
                            value={title}
                            helperText="This field is required"
                            error={error}
                            className={classes.formElement}
                        />
                        <TextField
                            id="description"
                            multiline
                            rows={4}
                            label="Description"
                            value={description}
                            helperText="This field is required"
                            error={error}
                            className={classes.formElement}
                        />
                        <FormControl className={classes.formElement}>
                            <CreatableSelect
                                id='customTags'
                                isMulti
                                value={selectCustomTag.value}
                                onChange={handleChangeCustomTag}
                                options={selectCustomTag.selectOptions} />
                        </FormControl>
                        <FormControl
                            className={classes.formElement}>
                            <Select
                                id='bodyTags'
                                isMulti
                                onChange={handleChangeBodyTag}
                                options={selectBodyTag.selectOptions} />
                        </FormControl>
                        <div className={classes.buttonContainer}>
                            <Button type="submit" variant="contained" color="primary"
                                className={classes.button}>
                                Submit
                            </Button>
                            <Button variant="contained"
                                className={classes.button}
                                onClick={() => props.cancel()}>
                                Cancel
                            </Button>
                        </div>
                    </FormControl>
                </form>
            </Grid>
            <Grid item xs={2} />
        </Grid >
    );
}
export default SaveLayout;
