import React, { useEffect } from "react";
import { useAuth } from "../context/userContext";
import Router from "next/router";

import Customer from "../components/Dashboards/Customer"
import Influencer from "../components/Dashboards/Influencer"
import Employee from "../components/Dashboards/Employee"
import Admin from "../components/Dashboards/Admin"

const Dashboard = () => {
  const { state } = useAuth();

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
  }, [state]);

  return (
    <>
      {state.user.role.name === "Customer" ? <Customer /> : null}
      {state.user.role.name === "Influencer" ? <Influencer /> : null}
      {state.user.role.name === "Employee" ? <Employee /> : null}
      {state.user.role.name === "Admin" ? <Admin /> : null}
    </>
  );
};

export default Dashboard;
