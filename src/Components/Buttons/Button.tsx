import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxShadow: "5px 5px 15px #0000001e",
      fontSize: "90%",
      [theme.breakpoints.down("sm")]: {
        fontSize: "12px",
      },
    },
    outlined: {
      border: "2px solid #20C969",
      color: "#20C969",
      "&:hover": {
        background: "#ffff",
      },
    },
    contained: {
      backgroundColor: "#20C969",
      color: "#fff",
      "&:hover": {
        background: "#20C969",
      },
    },
    blueContained: {
      backgroundColor: "#1C97D7",
      color: "#fff",
      "&:hover": {
        background: "#165E84",
      },
    },
    blueOutlined: {
      border: "2px solid #1C97D7",
      color: "#1C97D7",
      "&:hover": {
        border: "2px solid #1C97D7",
        color: "#1C97D7",
      },
    },
    redContained: {
      background: "red",
      color: "#fff",
      "&:hover": {
        background: "red",
        color: "#fff",
      },
    },
    redOutlined: {
      color: "red",
      border: "2px solid red",
      "&:hover": {
        color: "red",
        border: "2px solid red",
      },
    },
    orangeOutlined: {
      color: "orange",
      border: "2px solid orange",
      "&:hover": {
        color: "orange",
        border: "2px solid orange",
      },
    },
    grayOutlined: {
      color: "#757575",
      border: "1px solid #c4c4c4",

      // "&:hover": {
      //   color: "#c4c4c4",
      //   border: "2px solid black",
      // },
    },
  })
);

type props = {
  type:
    | "outlined"
    | "contained"
    | "blueContained"
    | "blueOutlined"
    | "redContained"
    | "redOutlined"
    | "orangeContained"
    | "orangeOutlined"
    | "grayOutlined";
  label: string;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
  className?: string;
  style?: React.CSSProperties;
  submit?: boolean;
  disabled?: boolean;
};

export default function OurButton({
  type,
  label,
  onClick,
  className,
  style,
  submit,
  disabled,
}: props) {
  const classes = useStyles();

  return (
    <Button
      onClick={onClick}
      style={style}
      disabled={disabled}
      classes={{
        root:
          type === "outlined"
            ? classes.outlined
            : type === "contained"
            ? classes.contained
            : type === "blueContained"
            ? classes.blueContained
            : type === "blueOutlined"
            ? classes.blueOutlined
            : type === "redOutlined"
            ? classes.redOutlined
            : type === "orangeOutlined"
            ? classes.orangeOutlined
            : type === "grayOutlined"
            ? classes.grayOutlined
            : classes.redContained,
      }}
      className={`${className} ${classes.root}`}
      {...(submit && { type: "submit" })}
    >
      {label}
    </Button>
  );
}
