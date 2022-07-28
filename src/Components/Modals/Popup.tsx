import React, { useEffect, useRef } from "react";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    scroll: {
      overflow: "hidden",
    },
    title: {
      textAlign: "center",
      color: "#0AA84E",
    },
    dialogPaper: {
      // minWidth: '90%',
      // maxWidth: '90%',
    },
  })
);

type props = {
  title?: string;
  children: React.ReactNode;
  onCloseHandler?: () => void;
  open: boolean;
  dialogPaper?: any;
  className?: string;
};

function Popup({
  className,
  title,
  children,
  onCloseHandler,
  open,
  dialogPaper,
}: props) {
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
      classes={{ paper: dialogPaper }}
      onClose={onCloseHandler}
      open={open}
      className={className}
      style={{ overflow: "hidden" }}
    >
      {title && <p className={classes.title}>{title}</p>}
      <DialogContent className={classes.scroll}> {children}</DialogContent>
    </Dialog>
  );
}
export default Popup;
