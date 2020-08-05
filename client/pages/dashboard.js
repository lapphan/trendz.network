import React, { useEffect } from "react";
import { useAuth } from "../context/userContext";
import Router, { withRouter } from "next/router";
import dynamic from "next/dynamic";
const Customer = dynamic(() => import("../components/Dashboards/Customer"));
const Influencer = dynamic(()=> import("../components/Dashboards/Influencer"))
const Employee = dynamic(()=>import("../components/Dashboards/Employee"))
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
    </>
  );
};

export default withRouter(Dashboard);
