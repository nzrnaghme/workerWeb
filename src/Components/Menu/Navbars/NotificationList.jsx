import React, { useState } from "react";
import classNames from "classnames";
import Notifications from "@material-ui/icons/Notifications";
import Poppers from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";

import styles from "./headerLinksStyle.js";
const useStyles = makeStyles(styles);

export default function NotificationList(props) {
  const classes = useStyles();
  const [openNotification, setOpenNotification] = useState(null);
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };

  return (
    <div className={classes.manager}>    
      <Button
        color={window.innerWidth > 959
          ? "transparent"
          : "white"}
        justIcon={window.innerWidth > 959}
        simple={!(window.innerWidth > 959)}
        aria-owns={openNotification
          ? "notification-menu-list-grow"
          : null}
        aria-haspopup="true"
        onClick={handleClickNotification}
        className={classes.buttonLink}>
        <Hidden mdUp implementation="css">
          <p onClick={handleCloseNotification} 
          className={classes.linkText}>
            اعلان ها  (6)
          </p>
        </Hidden> 
        <Notifications className={classes.icons} />
      </Button>
      <Poppers
        open={Boolean(openNotification)}
        anchorEl={openNotification}
        transition
        disablePortal
        className={
          classNames({ [classes.popperClose]: !openNotification })
          + " " +
          classes.popperNav
        }
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            id="notification-menu-list-grow"
            style={{
              transformOrigin:
                placement === "bottom"
                  ? "center top"
                  : "center bottom"
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleCloseNotification}>
                <MenuList role="menu">
                  <MenuItem
                    onClick={handleCloseNotification}
                    className={classes.dropdownItem}
                  >
                    Mike John responded to your email
                  </MenuItem>
                  <MenuItem
                    onClick={handleCloseNotification}
                    className={classes.dropdownItem}
                  >
                    You have 5 new tasks
                  </MenuItem>
                  <MenuItem
                    onClick={handleCloseNotification}
                    className={classes.dropdownItem}
                  >
                    You{"'"}re now friend with Andrew
                  </MenuItem>
                  <MenuItem
                    onClick={handleCloseNotification}
                    className={classes.dropdownItem} >
                    Another Notification
                  </MenuItem>
                  <MenuItem
                    onClick={handleCloseNotification}
                    className={classes.dropdownItem}>
                    Another One
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Poppers>
    </div>
  );
}