import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "3px",
    padding: "1rem",
    position: "relative",
  },
}));

type Props = {
  children: any;
  elevation?: number;
  className?: string;
};

function OurPaper({ children, elevation, className }: Props) {
  const classes = useStyles();

  return (
    <Paper classes={{ root: classes.root }} {...{ className, elevation }}>
      {children}
    </Paper>
  );
}

export default OurPaper;
