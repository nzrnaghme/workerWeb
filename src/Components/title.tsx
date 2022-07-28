import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import phototitle from "../Images/title.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type props = {
  label: string;
  icon: any;
  className?: string;
  classes?: string;
};

function Title({ className, classes, label, icon }: props) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        textAlign: "center",
        color: "black",
        margin: "100px",
        // top: "2.5%",
        // right: "-18.8%"
      }}
    >
      <img
        src={phototitle}
        // style={{position:"absolute"}}
        // width="13%"
      />
      <div
        style={{
          position: "absolute",
          right: "0%",
          fontSize: "20px",
          top: "44%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "row",
          width: "210px",
        }}
        className={classes}
      >
        <FontAwesomeIcon
          style={{
            display: "inline",
            color: "#1665C7",
            paddingRight: "10px",
            paddingTop: "9px",
            paddingLeft: "20px",
          }}
          icon={icon}
        />
        <div style={{ paddingLeft: "8%" }}>|</div>
        <div>{label}</div>
      </div>
    </div>
  );
}

export default Title;
