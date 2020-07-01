import React, { useEffect } from "react";
import Layout from "../components/layout";
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
