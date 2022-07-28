import React from 'react'; 
import {
    makeStyles,
    Theme,
    createStyles
} from '@material-ui/core/styles';

type props={
    styles?: object
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.down('xs')]: {
               fontSize:"10px"
            },
        },
    }),
);
function TimeHm({styles}: props) {
    const classes = useStyles();
    return (
        <div style={styles} className={classes.root}>
            clock
        </div>
    );
}

export default TimeHm
