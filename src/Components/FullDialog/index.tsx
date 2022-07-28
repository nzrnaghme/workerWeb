import React, { useEffect, useRef } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import "./index.scss";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  label: string;
  children: any;
  onEntered?: () => void;
  onExited?: () => void;
};

export default function FullScreenDialog({
  open,
  onCancel,
  onConfirm,
  label,
  children,
  onEntered,
  onExited,
}: Props) {
  const classes = useStyles();
  const openPopUp = useRef(open);

  useEffect(() => {
    window.addEventListener("popstate", (event) => {
      if (openPopUp.current) {
        openPopUp.current = false;
        window.history.go(1);
      }
    });
  }, [openPopUp.current]);

  useEffect(() => {
    if (open) {
      openPopUp.current = true;
    } else openPopUp.current = false;
  }, [open]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onCancel}
      TransitionComponent={Transition}
      TransitionProps={{
        onEntered,
        onExited,
      }}
    >
      <AppBar className="fullscreen-dialog-appbar">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {label}
          </Typography>
          {onConfirm && (
            <Button autoFocus color="inherit" onClick={onConfirm}>
              تایید
            </Button>
          )}
          <Button autoFocus color="inherit" onClick={onCancel}>
            بازگشت
          </Button>
        </Toolbar>
      </AppBar>
      <div>{children}</div>
    </Dialog>
  );
}
