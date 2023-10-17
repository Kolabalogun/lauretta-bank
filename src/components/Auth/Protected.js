import React from "react";
import { useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";

const Protected = ({ children }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  const location = useLocation().pathname;

  return currentUser ? (
    children
  ) : (
    <Redirect to={"/login"} state={{ from: location }} replace />
  );
};

export default Protected;
