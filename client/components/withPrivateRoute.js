import React, { useContext } from "react";
import Router from "next/router";

import { UserContext } from "../context/userContext";

const login = "/login";

const checkUserAuthentication = (token) => {
  return (token = "" ? false : true);
};

export default (WrappedComponent) => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
  const { jwt } = useContext(UserContext);

  hocComponent.getInitialProps = async ({ response }) => {
    const userAuth = await checkUserAuthentication(jwt);

    if (!userAuth?.auth) {
      if (response) {
        response.writeHead(302, {
          Location: login,
        });
        response.end();
      } else {
        Router.replace(login);
      }
    } else if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps(userAuth);
      return { ...wrappedProps, userAuth };
    }
    return { userAuth };
  };
  return hocComponent;
};
