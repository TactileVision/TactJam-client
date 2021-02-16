import React, { useEffect, useCallback, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import axios from 'axios'
import CreatableSelect from 'react-select/creatable';
import { TactonContext } from '../centralComponents/TactonContext';

const useStyles = makeStyles((theme) => ({
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 60
    },
    button: {
        margin: theme.spacing(1, 1, 0, 0),
    },
    formElement: {
        margin: '15px 0',
    }
}));

enum TagKind {
    CustomTag,
    BodyTag,
}

interface SaveLayoutProps {
    t: any
    returnToMainLayout: (tactonSaved:boolean) => void
}

interface Selector {
    value: string,
    label: string,
}

const SaveLayout = (props: SaveLayoutProps) => {
    const classes = useStyles();
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [errorForm, setErrorForm] = React.useState({
        requiredTitle: false
    });
    const [selectCustomTag, setSelectCustomTag] = React.useState({
        inputValue: '',
        value: [] as Selector[],
        selectOptions: [] as Selector[],
    });
    const [selectBodyTag, setSelectBodyTag] = React.useState({
        inputValue: '',
        value: [] as Selector[],
        selectOptions: [] as Selector[]
    });
    const { actuatorPositions, rawTacton, setTactonMetadata } = useContext(TactonContext)

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

    const validateForm = () => {
        let titleEmpty: boolean = (title === '');
        if (titleEmpty != errorForm.requiredTitle) {
            setErrorForm({
                requiredTitle: titleEmpty
            })
        }
        return (!titleEmpty);
    }
    const buf2hex = (buffer: ArrayBufferLike) => {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

    async function postTacton() {
        const hexString = buf2hex(rawTacton);
        const serverCustomTag: { name: string }[] = []
        const serverBodyTag: { name: string }[] = []
        for (let i = 0; i < selectCustomTag.value.length; i++) {
            serverCustomTag.push({ name: selectCustomTag.value[i].label })
        }
        for (let i = 0; i < selectBodyTag.value.length; i++) {
            serverBodyTag.push({ name: selectBodyTag.value[i].label })
        }

        await axios.post('tactons/combined', {
            title: title,
            description: description,
            libvtp: hexString,
            positions: actuatorPositions,
            tags: serverCustomTag,
            bodyTags: serverBodyTag
        }).then((response) => {
            setTactonMetadata(response.data)
            props.returnToMainLayout(true)
        })
            .catch((error) => {
                console.log("something go wrong");
                console.log(error)
                console.log(error.data)
            });
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateForm()) {
            postTacton()
        }
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
    const changeTag = (inputValue: any, actionMeta: any, kindOfTag: TagKind) => {
        //new item selected
        if (actionMeta.action == 'create-option') {
            const lastItem: Selector = inputValue[inputValue.length - 1];
            //check if string is valid
            if (checkGoodString(lastItem.label)) {
                const newTags = createNewTags(lastItem.label);
                if (kindOfTag === TagKind.CustomTag) {
                    const tempOne: Selector[] = selectCustomTag.value.concat(newTags)
                    const tempTwo: Selector[] = selectCustomTag.selectOptions.concat(newTags)
                    setSelectCustomTag({
                        ...selectCustomTag,
                        inputValue: '',
                        value: tempOne,
                        selectOptions: tempTwo
                    });
                }
                if (kindOfTag === TagKind.BodyTag) {
                    const tempOne: Selector[] = selectBodyTag.value.concat(newTags)
                    const tempTwo: Selector[] = selectBodyTag.selectOptions.concat(newTags)
                    setSelectBodyTag({
                        ...selectBodyTag,
                        inputValue: '',
                        value: tempOne,
                        selectOptions: tempTwo
                    });
                }
            }
        } else {
            if (kindOfTag === TagKind.CustomTag)
                setSelectCustomTag({
                    ...selectCustomTag,
                    inputValue: '',
                    value: inputValue
                });
            if (kindOfTag === TagKind.BodyTag)
                setSelectBodyTag({
                    ...selectBodyTag,
                    inputValue: '',
                    value: inputValue
                })
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.id === 'title')
            setTitle(event.target.value);
        if (event.target.id === 'description')
            setDescription(event.target.value);
    }
    return (
        // <Grid container justify="center" spacing={3} hidden={!props.active}>
        <Grid container justify="center" spacing={0}>
            <Grid item xs={2} />
            <Grid item xs={8}>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth={true}>
                        <TextField
                            id="title"
                            label="Title"
                            value={title}
                            onChange={handleChange}
                            helperText={errorForm.requiredTitle ? props.t('other.fieldRequired') : ''}
                            error={errorForm.requiredTitle}
                            className={classes.formElement}
                        />
                        <TextField
                            id="description"
                            multiline
                            rows={4}
                            label="Description"
                            value={description}
                            onChange={handleChange}
                            className={classes.formElement}
                        />
                        <FormControl className={classes.formElement}>
                            <CreatableSelect
                                id='customTags'
                                isMulti
                                value={selectCustomTag.value}
                                onChange={(value: any, action: any) => changeTag(value, action, TagKind.CustomTag)}
                                options={selectCustomTag.selectOptions} />
                        </FormControl>
                        <FormControl
                            className={classes.formElement}>
                            <CreatableSelect
                                id='bodyTags'
                                isMulti
                                value={selectBodyTag.value}
                                onChange={(value: any, action: any) => changeTag(value, action, TagKind.BodyTag)}
                                options={selectBodyTag.selectOptions} />
                        </FormControl>
                        <div className={classes.buttonContainer}>
                            <Button type="submit" variant="contained" color="primary"
                                className={classes.button}>
                                Submit
                            </Button>
                            <Button variant="contained"
                                className={classes.button}
                                onClick={() => props.returnToMainLayout(false)}>
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
export default withTranslation()(SaveLayout);
