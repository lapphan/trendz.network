import React, { useEffect, useState } from "react";
import Header from "../Header";
import HeaderLinks from "../Header/HeaderLinks"
import Footer from "../Footer";
import { useRouter } from "next/router";
import Transition from "../PageTransition";

const Layout = (props) => {
  const router = useRouter()
  const {pathname} = router;
  const { ...rest } = props;
    return (
      <div>
        <Header
        brand="TrendZ. Network"
        rightLinks={<HeaderLinks />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
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
