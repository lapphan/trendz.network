import React from "react";
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
import { Router } from "next/router";

const Dashboard = () => {
  const {state, dispatch} = useAuth();
    return <h1>Private dashboard for {state.user.username}</h1>;
};

export default Dashboard;
