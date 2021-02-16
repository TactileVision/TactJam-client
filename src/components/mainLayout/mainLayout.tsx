import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TimeProfile from '../timeProfile/timeProfile';
import ActuatorPlacement from "@/components/actuatorsPlacement/actuatorsPlacement";
import ConnectionLine from "@/components/deviceConnection/connectionLine";
import { InformContext, InformProvided } from '../centralComponents/InformContext'
import clsx from 'clsx';
import CustomAlert from '../centralComponents/CustomAlert'
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        // flexGrow: 1,
        width: '100%',
        height: '100%',
    },
    fullHeight: {
        'min-height': '100%',
        maxHeight: 600,
    },
    hide: {
        display: 'none'
    }
}));

export default function MainLayout(props: { active: boolean, slotNb: number, tactonSaved: boolean, cancelMessage: () => void }) {
    const classes = useStyles();

    const switchSaveLayoutError = (saveRequested: boolean[], informProvidList: InformProvided[]) => {
       // console.log('switchSaveLayoutError')
        if (saveRequested[props.slotNb - 1]) {
            const informProvid = informProvidList[props.slotNb - 1]
            if (informProvid.patternProvided) {
                if (!informProvid.positionProvided) {
                   // console.log('positionProvided false')
                    return (<Grid item xs={12}>
                        You have to place at least one motor.
                    </Grid>)
                }
            } else {
               // console.log('Pattern false')
                return (<Grid item xs={12}>
                    We don't receive a Pattern.
                </Grid>)
            }
        }
    }

    return (
        <InformContext.Consumer>
            {({ saveRequested, informProvidList }) => (
                // <div className={classes.root} hidden={!props.active}>
                <div className={clsx(classes.root, !props.active ? classes.hide : '')}>
                    <Grid container spacing={0} className={classes.root}>
                     {false  &&  <Grid container item xs={6} className={classes.fullHeight}> {/*style={{ borderRightStyle: 'solid', borderColor: 'black', borderWidth: '1em' }}>*/}
                            <TimeProfile />
                        </Grid>}
                        <Grid container item xs={12} className={classes.fullHeight}>
                            <ActuatorPlacement />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomAlert
                                showAlert={props.tactonSaved}
                                notifyParentCancel={() => props.cancelMessage()}
                                message='save.success'
                                severity='success' />
                        </Grid>
                        {switchSaveLayoutError(saveRequested, informProvidList)}
                    </Grid>
                    <ConnectionLine />
                </div>)}
        </InformContext.Consumer>
    );
}
