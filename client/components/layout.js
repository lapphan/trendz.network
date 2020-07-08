import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../context/userContext";

const Layout = (props) => {
  const { state } = useAuth();
  const [isLoggedIn, setLoggedIn] = useState(false)
  useEffect(()=>{
    if(state.jwt!==""){
      setLoggedIn(true)
    }
  },[state.jwt])
  if (isLoggedIn) {
    return (
      <React.Fragment>
        <Header />
        <main>
          <div className="section">{props.children}</div>
        </main>
      </React.Fragment>
    );
  } else
    return (
      <React.Fragment>
        <Header />
        <main>
          <div>{props.children}</div>
        </main>
        <Footer />
      </React.Fragment>
    );
};

export default Layout;
