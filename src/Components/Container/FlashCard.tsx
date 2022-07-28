import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles(theme => ({
    arrow: {
        width: '200px',
        height: '50px',
        background: '#F9F9FB',
        position: 'relative',
        borderBottomLeftRadius: '3px',
        borderTopLeftRadius: '3px',
        boxShadow: '1px 4px 50px 5px #eee',
        '&::before': {
            content: '" "',
            position: 'absolute',
            width: '0',
            height: '0',
            right: '-15px',
            borderTop: '25px solid transparent',
            borderBottom: '25px solid transparent',
            borderLeft: '15px solid #F9F9FB',
        }
    },
    label: {
        display: 'inline',
        color: '#1665C7',
        fontSize: '110%',
        paddingLeft: '10px',
        [theme.breakpoints.down('xs')]: {
            fontSize: '90%'
        },
        
    },
    divider: {
        display: 'inline',
        borderLeft: '0.09em solid #1665C7',
    },
    icon: {
        display: 'inline',
        color: '#1665C7',
        paddingRight: '10px',
        paddingTop: '15px',
        paddingLeft: '5px',
        fontSize: '20px'
    },
}));

type props = {
    label: string;
    icon: any;
    styles?: object;
}

function FlashCard({ label, icon, styles }: props) {
    const classes = useStyles();

    return (
        <span className={classes.arrow} style={styles}>
            <FontAwesomeIcon className={classes.icon} icon={icon} />
            <span className={classes.divider} />
            <Typography
                className={classes.label}
                variant="h6"
            >
                {label}
            </Typography>
        </span>
    );
}
export default FlashCard;