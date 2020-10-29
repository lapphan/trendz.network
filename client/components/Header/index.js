import Link from "next/link";
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
import Router from "next/router";

// import StyledHeader from './StyledHeader';
// import Link from '../Link';
// import logo from '../../assets/img/logo.svg';

/* TYPES */
export const LOGOUT = "LOGOUT";
/* END */

const TestButton = React.forwardRef(({ children, href, onClick }, ref) => (
  <p ref={ref} href={href} onClick={onClick}>
    {children}
  </p>
));

function Header() {
  const { state, dispatch } = useAuth();
  const [isOpen, toggleIsOpen] = useState(false);
  const [navColor, setNavColor] = useState({
    color: "navbar-transparent",
  });
  const [navCollapse, setNavCollapse] = useState({
    collapseOut: "",
  });
  const [isLoggedIn, setLoggedIn] = useState(false);
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
    //Router.reload();
    
    Router.push("/login")
    location.reload()
  };

  const renderUnloggedInButton = (
    <Nav navbar>
      <NavItem>
          <Link href="/login">
            <Button className="nav-link d-none d-lg-block" color="default">Đăng nhập</Button>
          </Link>
        <NavLink
          className="nav-pills d-lg-none d-xl-none"
          onClick={toggleCollapse}
        >
          <Link href="/login">
            <TestButton>Đăng nhập</TestButton>
          </Link>
        </NavLink>
      </NavItem>
      <NavItem>
        
          <Link href="/register">
            <Button className="nav-link d-none d-lg-block" color="primary">Đăng ký</Button>
          </Link>
        <NavLink className="d-lg-none d-xl-none" onClick={toggleCollapse}>
          <Link href="/register">
            <TestButton>Đăng ký</TestButton>
          </Link>
        </NavLink>
      </NavItem>
    </Nav>
  );

  const renderLoggedInButton = (
    <Nav navbar>
      {/* <NavItem>
          <Link href="/create">
          <Button className="nav-link d-none d-lg-block" color="warning">Tạo campaign</Button>
          </Link>
        
          <Link href="/create">
          <NavLink
          className="nav-pills d-lg-none d-xl-none"
          onClick={toggleCollapse}
        >Tạo campaign</NavLink>
          </Link>
      </NavItem> */}
      <NavItem>     
          <Link href="/profile">
          <Button className="nav-link d-none d-lg-block" color="warning">Hồ sơ</Button>
          </Link>
        <NavLink
          className="nav-pills d-lg-none d-xl-none"
          onClick={toggleCollapse}
        >
          <Link href="/profile">
            <TestButton>Hồ sơ</TestButton>
          </Link>
        </NavLink>
      </NavItem>
      <NavItem>
        
          <Link href="/">
          <Button
          className="nav-link d-none d-lg-block"
          color="default"
          onClick={handleLogout}
        >Đăng xuất</Button>
          </Link>

        <NavLink
          className="nav-pills d-lg-none d-xl-none"
          onClick={() => {
            toggleCollapse();
            handleLogout();
          }}
        >
          <Link href="/">
            <TestButton>Đăng xuất</TestButton>
          </Link>
        </NavLink>
      </NavItem>
    </Nav>
  );

  const renderUnloggedBrand = (
    <Link href="/">
      <TestButton>
        <span>TRENDZ • </span>
        NETWORK
      </TestButton>
    </Link>
  );

  const renderLoggedBrand = (
    <Link href="/dashboard">
      <TestButton>
        <span>TRENDZ • </span>
        NETWORK
      </TestButton>
    </Link>
  );

  useEffect(() => {
    if (state.jwt !== "") {
      setLoggedIn(true);
    }
  }, [state.jwt]);

  return (
    <Navbar
      className={`fixed-top ${navColor.color}`}
      color-on-scroll="100"
      expand="lg"
    >
      <Container>
        <div className="navbar-translate">
          <NavbarBrand id="navbar-brand">
            {!isLoggedIn ? renderUnloggedBrand : renderLoggedBrand}
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
          {!isLoggedIn ? renderUnloggedInButton : renderLoggedInButton}
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
