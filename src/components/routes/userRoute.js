import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
// slices
import { selectSession } from "../../slices/sessionSlice";

// TODO
export default function UserRoute({ children, path }) {
  const { isLogin, authority } = useSelector(selectSession);
  return (
    <Route
      path={path}
      render={() => {
        if (!isLogin) return <Redirect to="/login" />;
        if (authority === 1) return <Redirect to="/" />;
        return children;
      }}
    />
  );
}
