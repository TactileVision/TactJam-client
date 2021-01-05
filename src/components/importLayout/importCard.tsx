import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

interface importCardInterface {
    patternID: number;
    title: string;
    tags: string[];
}

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

const ImportCard = ({ patternID, title, tags }: importCardInterface) => {
    const classes = useStyles();
    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography gutterBottom  variant="h5" component="h2">
                   Title: {title}
                </Typography>
                    Description: {title}
                <br />
                    tags:
                    {tags.map((value, index) => {
                    return (<span key={index}>&nbsp;{value}&nbsp;</span>)
                })}
            </CardContent>
            <CardActions>
                <Button size="small" color="primary">Import</Button>
            </CardActions>
        </Card>
    );
}

export default ImportCard;
