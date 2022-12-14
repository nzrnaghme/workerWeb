import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import AdminNavbarLinks from "./AdminNavbarLinks";
import topImage from "../../../Images/top_image_white.png";

//hooks


import styles from "./headerStyle.js";

const useStyles = makeStyles(styles);

export default function Header(props) {
  const classes = useStyles();

  const { color } = props;
  const appBarClasses = classNames({
    [" " + classes[color]]: color,
  });
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          {/* <Button color="white" 
          href="/" className={classes.title}>
            Yootaab1
          </Button> */}
          <img src={topImage} alt="logo" style={{height:'52px',width:'140px'}} />
        </div>
        <Hidden smDown implementation="css">
          {<AdminNavbarLinks
            logout={props.logout}
            openProfilePageClick={props.openProfile}
          />}
        </Hidden>
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

// Header.propTypes = {
//   color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
//   rtlActive: PropTypes.bool,
//   handleDrawerToggle: PropTypes.func,
//   routes: PropTypes.arrayOf(PropTypes.object),
// };
