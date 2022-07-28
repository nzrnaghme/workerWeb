import React, { useState } from "react";
import classNames from "classnames";
import { useGeneralContext } from "../../../Providers/GeneralContext";
import Poppers from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Person from "@material-ui/icons/Person";
import Divider from "@material-ui/core/Divider";
import styles from "./headerLinksStyle.js";
const useStyles = makeStyles(styles);

export default function ProfileButton({ openProfilePageClick, logout }: props) {
  const classes = useStyles();
  const [openProfile, setOpenProfile] = React.useState(null);

  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };

  const handleCloseProfile = () => {
    setOpenProfile(null);
  };

  const openProfileClick = () => {
    handleCloseProfile();
    if (openProfilePageClick != null) openProfilePageClick();
  };

  const logoutClick = () => {
    logout();
  };

  return (
    <div className={classes.manager}>
      <Button
        color={window.innerWidth > 959 ? "transparent" : "white"}
        justIcon={window.innerWidth > 959}
        simple={!(window.innerWidth > 959)}
        aria-owns={openProfile ? "profile-menu-list-grow" : null}
        aria-haspopup="true"
        onClick={handleClickProfile}
        className={classes.buttonLink}
      >
        <Hidden mdUp implementation="css">
          <p className={classes.linkText}>پروفایل</p>
        </Hidden>
        <Person className={classes.icons} />
      </Button>
      <Poppers
        open={Boolean(openProfile)}
        anchorEl={openProfile}
        transition
        disablePortal
        className={
          classNames({ [classes.popperClose]: !openProfile }) +
          " " +
          classes.popperNav
        }
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            id="profile-menu-list-grow"
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleCloseProfile}>
                <MenuList role="menu">
                  <MenuItem
                    onClick={openProfileClick}
                    className={classes.dropdownItem}
                  >
                    پروفایل
                  </MenuItem>
                  {/* <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      Settings
                    </MenuItem> */}
                  <Divider light />
                  <MenuItem
                    onClick={logoutClick}
                    className={classes.dropdownItem}
                  >
                    خروج
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
