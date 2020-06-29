import React, { useEffect } from "react";
import Layout from "../components/layout";
// import withPrivateRoute from '../components/withPrivateRoute';

// const Dashboard = () => {
//   return <div>This is a Dashboard page which is private.</div>;
// };

// Dashboard.getInitialProps = async props => {
//   console.info('##### Congratulations! You are authorized! ######', props);
//   return {};
// };

// export default withPrivateRoute(Dashboard);

import { useAuth } from "../context/userContext";
import Router from "next/router";

const Dashboard = () => {
  const { state } = useAuth();
  useEffect(() => {
    if (state.jwt === "") 
    Router.push("/login");
  }, [state]);

  if (state.jwt !== "")
    return (
      <Layout>
        <h1>Private dashboard for {state.user.username}</h1>
      </Layout>
    );
  else return null;
};

export default Dashboard;
