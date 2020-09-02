import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { useAuth } from "../../context/userContext";
import { useRouter } from "next/router";

const Layout = (props) => {
  const { state } = useAuth();
  const router = useRouter();
  const { pathname } = router;
  const [isLoggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (state.jwt !== "") {
      setLoggedIn(true);
    }
  }, [state.jwt]);
  if (isLoggedIn) {
    return (
      <div>
        <Header />
          <main>
            <div className="section">{props.children}</div>
          </main>
      </div>
    );
  } else
    return (
      <div>
        <Header />
          <main>
            <div>{props.children}</div>
          </main>
        <Footer />
      </div>
    );
};

export default Layout;
