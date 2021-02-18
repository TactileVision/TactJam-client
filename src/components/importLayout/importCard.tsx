import React from 'react';
import { makeStyles, Theme, createStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Tacton, TagList, Tag } from '../centralComponents/TactonContext';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAccordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

interface ImportCardInterface {
    tacton: Tacton;
    onClickImport: (tacton: Tacton) => void
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
        heading: {
            flexBasis: '25%',
            flexShrink: 0,
        },
        tag: {
            marginRight: 10
        }
    }),
);

const Accordion = withStyles({
    root: {
        border: 'none',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);


const ImportCard = ({ tacton, onClickImport }: ImportCardInterface) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = () => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        if (tacton.description.length > 79)
            setExpanded(isExpanded);
    };

    const shortDescription = (description: string) => {
        let temp = description.substring(0, 100)
        if (temp.length > 50) {
            const firstPart = temp.substring(0, 50);
            const secondPart = temp.substring(50, temp.length);
            temp = firstPart + ' ' + secondPart;
        }
        return temp
    }
    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    Title: {tacton.title}
                </Typography>
                <Accordion expanded={expanded} onChange={handleChange()}>
                    <AccordionSummary
                        style={{ padding: 0 }}
                        expandIcon={(tacton.description.length > 79 || tacton?.tags?.length > 4 || tacton?.bodytags?.length > 4) && <ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>Description</Typography>
                        {!expanded && <Typography>{
                            shortDescription(tacton.description)} {tacton.description.length > 100 ? '...' : ''}</Typography>}
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {tacton.description}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={false}>
                    <AccordionSummary
                        style={{ padding: 0 }}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>Custom tags</Typography>
                        {/*{!expanded && <Typography>{tacton?.tags?.map((value, index) => {*/}
                        {/*    if (index < 4)*/}
                        {/*        return (<span key={value.id} className={classes.tag}>{value.name}</span>)*/}
                        {/*})}</Typography>}*/}
                        {<Typography>{tacton?.tags?.map((value, index) => {
                            return (<span key={value.id} className={classes.tag}>{value.name}</span>)
                        })}</Typography>}
                    </AccordionSummary>
                </Accordion>
                <Accordion expanded={false}>
                    <AccordionSummary
                        style={{ padding: 0 }}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>Body tags</Typography>
                        {/*{!expanded && <Typography> {tacton?.bodytags?.map((value, index) => {*/}
                        {/*    if (index < 4)*/}
                        {/*        return (<span key={value.id} className={classes.tag}>{value.name}</span>)*/}
                        {/*})}</Typography>}*/}
                        {<Typography>{tacton?.bodytags?.map((value, index) => {
                            return (<span key={value.id} className={classes.tag}>{value.name}</span>)
                        })}</Typography>}
                    </AccordionSummary>
                </Accordion>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={() => onClickImport(tacton)}>Import</Button>
            </CardActions>
        </Card>
    );
}

export default ImportCard;
