import React, { useEffect } from "react";

// import Layout from '../components/layout'
import { Container } from "reactstrap";
import { useAuth } from "../context/userContext";
import Router, { withRouter } from "next/router";
import Parallax from "../components/Parallax/Parallax";
const Home = (props) => {
  useEffect(() => {
    document.body.classList.toggle("index-page");
    return () => {
      document.body.classList.toggle("index-page");
    };
  }, []);

  const { state } = useAuth();

  useEffect(() => {
    if (state.jwt === "") return;
    Router.push("/dashboard");
  }, [state]);
  return (
    <Parallax>
      <div>
        <div className="page-header header-filter">
          <div className="squares square1" />
          <div className="squares square2" />
          <div className="squares square3" />
          <div className="squares square4" />
          <div className="squares square5" />
          <div className="squares square6" />
          <div className="squares square7" />
          <Container>
            <div className="content-center brand">
              <h1 className="h1-seo">Trendz Network</h1>
              <h3 className="d-none d-sm-block">Awesome network</h3>
            </div>
          </Container>
        </div>
      </div>
    </Parallax>
  );
};

export default withRouter(Home);
