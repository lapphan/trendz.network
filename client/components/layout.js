import React from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";

const Layout = (props) => (
  <React.Fragment>
    <Head>
      <title>Trendz Network</title>
    </Head>
    <Header />
    <main>
      <div>{props.children}</div>
    </main>
    <Footer/>
  </React.Fragment>
);

export default Layout;
