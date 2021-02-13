import React, { VoidFunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Tacton } from '../centralComponents/TactonContext';

interface ImportCardInterface {
    tacton: Tacton;
    onClickImport: (tacton:Tacton) => void
}

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        margin: '10px',
        padding: '0px'
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

const ImportCard = ({ tacton, onClickImport }: ImportCardInterface) => {
    const classes = useStyles();
    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    Title: {tacton.title}
                </Typography>
                    Description: {tacton.description}
                <br />
                    tags:
                    {tacton?.tags?.map((value, index) => {
                    return (<span key={value.id}>&nbsp;{value.name}&nbsp;</span>)
                })}
                <br />
                    bodyTags:
                    {tacton?.bodytags?.map((value, index) => {
                    return (<span key={value.id}>&nbsp;{value.name}&nbsp;</span>)
                })}
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={() => onClickImport(tacton)}>Import</Button>
            </CardActions>
        </Card>
    );
}

export default ImportCard;
