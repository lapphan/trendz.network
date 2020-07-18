/*eslint-disable*/
import React, { useState, useEffect } from "react";
import Link from "next/link";

// @material-ui/core components
import { makeStyles, List, ListItem } from "@material-ui/core";

// core components
import Button from "components/CustomButtons/Button.js";

import styles from "../../assets/jss/nextjs-material-kit/components/headerLinksStyle.js";

import { useAuth } from "../../context/userContext";
export const LOGOUT = "LOGOUT";

const useStyles = makeStyles(styles);

export default function HeaderLinks() {
  const classes = useStyles();
  const { state, dispatch } = useAuth();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    dispatch({ type: LOGOUT });
    Router.reload();
    location.reload();
    Router.push("/");
  };

  const renderUnloggedInButton = (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Link href="/login">
          <Button color="transparent" className={classes.navLink}>
            Đăng nhập
          </Button>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Link href="/register">
          <Button color="transparent" className={classes.navLink}>
            Đăng ký
          </Button>
        </Link>
      </ListItem>
    </List>
  );

  const renderLoggedInButton = (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Link href="/create">
          <Button color="transparent" className={classes.navLink}>
            Tạo campaign
          </Button>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Link href="/profile">
          <Button color="transparent" className={classes.navLink}>
            Hồ sơ
          </Button>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Link href="/">
          <Button
            color="transparent"
            className={classes.navLink}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </Link>
      </ListItem>
    </List>
  );

  useEffect(() => {
    if (state.jwt !== "") {
      setLoggedIn(true);
    }
  }, [state.jwt]);

  return (
    <>
    {isLoggedIn ? renderLoggedInButton : renderUnloggedInButton}
    </>
  );
}
