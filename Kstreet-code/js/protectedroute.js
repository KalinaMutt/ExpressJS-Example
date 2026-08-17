import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  let location = useLocation();
  if (location.pathname!=="/" && location.pathname!=="/SHome" && location.pathname!=="/AHome") {
    location.pathname="/"
  }
  if (localStorage.getItem("auth-token") !== "authed") {
    localStorage.clear();
  }
  if (
    localStorage.getItem("auth-token") !== "authed" &&  
    location.pathname !== "/"
  ) {
    localStorage.clear()
    return <Navigate to="/" state={{ from: location }} replace />;
  } else if (
    localStorage.getItem("auth-token") === "authed" &&
    location.pathname === "/"
  ) {
    if (localStorage.getItem("admin-token") === "0") {
      return <Navigate to="/SHome" state={{ from: location }} replace />;
    } else if (localStorage.getItem("admin-token") === "1") {
      return <Navigate to="/AHome" state={{ from: location }} replace />;
    }
  }
  if (localStorage.getItem("auth-token") === "authed" &&
  location.pathname === "/AHome" && localStorage.getItem("admin-token") === "0") {
    return <Navigate to="/SHome" state={{ from: location }} replace />;
  }
  if (localStorage.getItem("auth-token") === "authed" &&
  location.pathname === "/SHome" && localStorage.getItem("admin-token") === "1") {
    return <Navigate to="/AHome" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
