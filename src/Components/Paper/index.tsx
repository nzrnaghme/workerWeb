import React from "react";
import Paper from "@material-ui/core/Paper";
import "./index.scss";

type Props = {
  children?: any;
  elevation?: number;
  className?: string;
  id?: string;
  paperClicked?: () => void;
};

function YPaper({ children, elevation, className, id, paperClicked }: Props) {
  return (
    <Paper
      className={`paper ${className}`}
      {...{ elevation, id }}
      onClick={paperClicked}
    >
      {children}
    </Paper>
  );
}

export default YPaper;
