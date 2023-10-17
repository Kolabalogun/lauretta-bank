import React from "react";
import { Redirect } from "react-router-dom";

import { useSelector } from "react-redux";

const UnAuthenticated = ({ children }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return currentUser === null ? children : <Redirect to={"/app"} replace />;
};

export default UnAuthenticated;
