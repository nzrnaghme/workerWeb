/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
// core components
import styles from "./footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {

  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            {/* <ListItem className={classes.inlineBlock}>
              <a href="https://Yootaab.ire" className={classes.block}>
                Home
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://Yootaab.ir" className={classes.block}>
                Company
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://Yootaab.ir" className={classes.block}>
                Portfolio
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://Yootaab.ir" className={classes.block}>
                Blog
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
             
            </ListItem>*/}
            <ListItem className={classes.inlineBlock}> 
            <span>
            {/* &copy; {1900 + new Date().getYear()}{" "} */}
             ({props.version})
            <a
              href="https://Yootaab.ir"
              target="_blank"
              className={classes.a}
            >
              &nbsp;&nbsp;Yootaab.ir 
            </a>
          </span>
            </ListItem>
          </List>
       
          
       
      </div>
      </div>
    </footer>
  );
}
