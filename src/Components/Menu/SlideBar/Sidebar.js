/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { NavLink, useLocation } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

import AdminNavbarLinks from "../Navbars/AdminNavbarLinks";
import styles from "./sidebarStyle.js";

const useStyles = makeStyles(styles);

const createPath = (route) => {
  if (route.to.includes('/:')) {
    let page = route.to.split('/:')[0];
    let newPath = page + '/' + route.property;
    return newPath;
  } else {
    return route.to;
  }
}

export default function Sidebar(props) {
 const storageUser = showLocalStorage("user");

  const classes = useStyles();
  let location = useLocation();
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return location.pathname === routeName;
  }
  const {
    version,
    color,
    logo,
    image,
    logoText,
    routes,
    logout,
    openProfile
  } = props;
  var links = (
    <List className={classes.list}>
      {routes
        .filter((c) => c.showinMenu)
        .map((prop, key) => {
          let userLogin = storageUser;
          if (prop.to != '/Login'
            && (userLogin?.Id == '' || userLogin?.Id == undefined || userLogin?.Id == null)) {
            return;
          }
          var activePro = " ";
          var listItemClasses;
          listItemClasses = classNames({
            [" " + classes[color]]: activeRoute(prop.to),
          });
          const whiteFontClasses = classNames({
            [" " + classes.whiteFont]: activeRoute(prop.to),
          });
          return (
            <NavLink
              to={createPath(prop)}
              className={activePro + classes.item}
              activeClassName="active"
              key={key}
            >
              <ListItem button className={classes.itemLink + listItemClasses}>
                {typeof prop.icon === "string" ? (
                  <Icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: false,
                    })}
                  >
                    {prop.icon}
                  </Icon>
                ) : (
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: false,
                    })}
                  />
                )}
                <ListItemText
                  primary={prop.title}
                  className={classNames(classes.itemText, whiteFontClasses, {
                    [classes.itemTextRTL]: false,
                  })}
                  disableTypography={true}
                />
              </ListItem>
            </NavLink>
          );
        })}
    </List>
  );
  var brand = (
    <div className={classes.logo}>
      <a
        href="https://Yootab.ir"
        className={classNames(classes.logoLink, {
          [classes.logoLinkRTL]: false,
        })}
        target="_blank"
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </a>
    </div>
  );
  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={"right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: false,
            }),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {
              <AdminNavbarLinks logout={
                logout
              }
                openProfilePageClick={
                  openProfile
                }
              />}

            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      {/* wide  */}
      <Hidden smDown implementation="css">
        <Drawer
          anchor={"left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: false,
            }),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}
          >
            {links}

            <div style={{
              color: 'white',
              position: 'absolute',
              bottom: '5px',
              right: '70px'
            }}>
              نسخه ({version})
            </div>
          </div>

          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}


        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
