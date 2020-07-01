import React from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../context/userContext";

const Layout = (props) => {
  const { state } = useAuth();
  if (state.jwt !== "") {
    return (
      <React.Fragment>
        <Head>
          <title>Trendz Network</title>
        </Head>
        <Header />
        <main>
          <div className="section">{props.children}</div>
        </main>
      </React.Fragment>
    );
  } else
    return (
      <React.Fragment>
        <Head>
          <title>Trendz Network</title>
        </Head>
        <Header />
        <main>
          <div>{props.children}</div>
        </main>
        <Footer />
      </React.Fragment>
    );
};

export default Layout;
