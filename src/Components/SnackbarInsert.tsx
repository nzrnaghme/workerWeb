import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SnackbarY from '@material-ui/core/Snackbar';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: '32rem',
            margin: '1rem auto'
        },
    }),
);

type props = {
    open: boolean;
    msg: string;
    waiting?: number,
}

function SnackbarInsert({ waiting, open, msg}: props) {
    const classes = useStyles();
    return (
        <SnackbarY
            classes={{ root: classes.root }}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={open}
            autoHideDuration={waiting}
            message={msg}
        />
    );
}

export default SnackbarInsert