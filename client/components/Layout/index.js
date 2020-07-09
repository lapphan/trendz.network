import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { useAuth } from "../../context/userContext";
import { useRouter } from "next/router";
import Transition from "../PageTransition";

const Layout = (props) => {
  const { state } = useAuth();
  const router = useRouter()
  const {pathname} = router
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
        <Transition location={pathname}>
        <main>
          <div className="section">{props.children}</div>
        </main>
        </Transition>
      </div>
    );
  } else
    return (
      <div>
        <Header />
        <Transition location={pathname}>
          <main>
            <div>{props.children}</div>
          </main>
        </Transition>
        <Footer />
      </div>
    );
};

export default Layout;
