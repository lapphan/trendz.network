import Link from "next/link";
//import { logout } from '../../utils/auth'

/**
 *
 * Header
 *
 */

import React, { useState, useEffect, useCallback } from "react";

import {
  Button,
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
  Row,
  Col,
  NavLink,
} from "reactstrap";

import { useAuth } from "../../context/userContext";

// import StyledHeader from './StyledHeader';
// import Link from '../Link';
// import logo from '../../assets/img/logo.svg';

/* TYPES */
export const LOGOUT = "LOGOUT";
/* END */

function Header() {
  const { state, dispatch } = useAuth();
  const [isOpen, toggleIsOpen] = useState(false);
  const [navColor, setNavColor] = useState({
    color: "navbar-transparent",
  });
  const [navCollapse, setNavCollapse] = useState({
    collapseOut: "",
  });

  const changeColor = useCallback(() => {
    if (
      document.documentElement.scrollTop > 99 ||
      document.body.scrollTop > 99
    ) {
      setNavColor((previousState) => {
        return {
          ...previousState,
          color: "bg-navbar",
        };
      });
    } else if (
      document.documentElement.scrollTop < 100 ||
      document.body.scrollTop < 100
    ) {
      setNavColor((previousState) => {
        return {
          ...previousState,
          color: "navbar-transparent",
        };
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", changeColor);
    return () => {
      window.removeEventListener("scroll", changeColor);
    };
  }, [changeColor]);

  const toggleCollapse = () => {
    document.documentElement.classList.toggle("nav-open");
    toggleIsOpen((isOpen) => !isOpen);
  };

  const onCollapseExiting = () => {
    setNavCollapse((previousState) => {
      return {
        ...previousState,
        collapseOut: "collapsing-out",
      };
    });
  };
  const onCollapseExited = () => {
    setNavCollapse((previousState) => {
      return {
        ...previousState,
        collapseOut: "",
      };
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    dispatch({ type: LOGOUT });
  };

  const renderButton =
    state.jwt === "" ? (
      <Nav navbar>
        <NavItem>
          <Button className="nav-link d-none d-lg-block" color="default">
            <Link href="/login">
              <a>Đăng nhập</a>
            </Link>
          </Button>
          <NavLink
            className="nav-pills d-lg-none d-xl-none"
            onClick={toggleCollapse}
          >
            <Link href="/login">
              <a>Đăng nhập</a>
            </Link>
          </NavLink>
        </NavItem>
        <NavItem>
          <Button className="nav-link d-none d-lg-block" color="primary">
            <Link href="/register">
              <a>Đăng ký</a>
            </Link>
          </Button>
          <NavLink className="d-lg-none d-xl-none" onClick={toggleCollapse}>
            <Link href="/register">
              <a>Đăng ký</a>
            </Link>
          </NavLink>
        </NavItem>
      </Nav>
    ) : (
      <Nav navbar>
        <NavItem>
          <Button className="nav-link d-none d-lg-block" color="default">
            <Link href="/profile">
              {/* <i class="tim-icons icon-single-02" aria-hidden="true" /> */}
              <a>Hồ sơ</a>
            </Link>
          </Button>
          <NavLink
            className="nav-pills d-lg-none d-xl-none"
            onClick={toggleCollapse}
          >
            <Link href="/profile">
              {/* <i class="tim-icons icon-single-02" aria-hidden="true"></i> */}
              <a>Hồ sơ</a>
            </Link>
          </NavLink>
        </NavItem>
        <NavItem>
          <Button
            className="nav-link d-none d-lg-block"
            color="default"
            onClick={handleLogout}
          >
            <Link href="/">
              <a>Đăng xuất</a>
            </Link>
          </Button>
          <NavLink
            className="nav-pills d-lg-none d-xl-none"
            onClick={() => {
              toggleCollapse();
              handleLogout();
            }}
          >
            <Link href="/">
              <a>Đăng xuất</a>
            </Link>
          </NavLink>
        </NavItem>
      </Nav>
    );

  return (
    <Navbar
      className={`fixed-top ${navColor.color}`}
      color-on-scroll="100"
      expand="lg"
    >
      <Container>
        <div className="navbar-translate">
          <NavbarBrand id="navbar-brand">
            <Link href="/">
              <a>
                <span>TRENDZ • </span>
                NETWORK
              </a>
            </Link>
          </NavbarBrand>
          <button
            aria-expanded={isOpen}
            className="navbar-toggler navbar-toggler"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
          </button>
        </div>
        <Collapse
          className={`justify-content-end ${navCollapse.collapseOut}`}
          navbar
          isOpen={isOpen}
          onExiting={onCollapseExiting}
          onExited={onCollapseExited}
        >
          <div className="navbar-collapse-header">
            <Row>
              <Col className="collapse-brand" xs="6"></Col>
              <Col className="collapse-close text-right" xs="6">
                <button
                  aria-expanded={isOpen}
                  className="navbar-toggler"
                  onClick={toggleCollapse}
                >
                  <i className="tim-icons icon-simple-remove" />
                </button>
              </Col>
            </Row>
          </div>
          {renderButton}
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
