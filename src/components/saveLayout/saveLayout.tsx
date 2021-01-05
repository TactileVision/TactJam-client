import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

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


const SaveLayout = () => {
    const classes = useStyles();
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [tags, setTags] = React.useState<string[]>([]);
    const [bodyParts, setBodyParts] = React.useState<string[]>([]);
    const [error, setError] = React.useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(true);
    };

    const handleChangeTags = (event: React.ChangeEvent<{ value: unknown }>) => {
        setTags(event.target.value as string[]);
    };
    const handleChangeBodyParts = (event: React.ChangeEvent<{ value: unknown }>) => {
        setBodyParts(event.target.value as string[]);
    };

    return (
        <Grid container justify="center" spacing={3}>
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
                        />
                        <TextField
                            id="description"
                            multiline
                            rows={4}
                            label="Description"
                            value={description}
                            helperText="This field is required"
                            error={error}
                        />
                        <FormControl>
                            <InputLabel id="tags-label">Select your Tags</InputLabel>
                            <Select
                                labelId="tags-label"
                                id="tags"
                                multiple
                                value={tags}
                                onChange={handleChangeTags}
                                input={<Input />}
                                renderValue={(selected) => (selected as string[]).join(', ')}
                                MenuProps={MenuProps}
                            >
                                {names.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={tags.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="body-parts-label">Select the used bodyparts</InputLabel>
                            <Select
                                labelId="body-parts-label"
                                id="body-parts"
                                multiple
                                value={bodyParts}
                                onChange={handleChangeBodyParts}
                                input={<Input />}
                                renderValue={(selected) => (selected as string[]).join(', ')}
                                MenuProps={MenuProps}
                            >
                                {names.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={bodyParts.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="outlined" color="primary" className={classes.button} style={{marginTop:'60px'}}>
                            Submit
        </Button>
                    </FormControl>
                </form>
            </Grid>
            <Grid item xs={2}/>
        </Grid>
    );
}
export default SaveLayout;