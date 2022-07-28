import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SnackbarY from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

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
    closeHandler: (_: any, reason?: string | undefined) => void ;
    okHandler: () => void;
    msg: string;
    waiting?:number
}

function Snackbar({ waiting, open, closeHandler, okHandler, msg }: props) {
    const classes = useStyles();
    return (
        <SnackbarY
            classes={{ root: classes.root}}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={open}
            autoHideDuration={waiting || 6000}
            onClose={closeHandler}
            message={msg}
            action={
                <>
                    <IconButton size="small" aria-label="close" color="primary" onClick={okHandler}>
                        <DoneIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" aria-label="close" color="secondary" onClick={closeHandler}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </>
            }
        />
    );
}

export default Snackbar