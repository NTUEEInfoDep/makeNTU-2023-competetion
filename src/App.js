import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

// Route
import { Redirect } from "react-router";
import PublicRoute from "./components/routes/publicRoute";
import AdminRoute from "./components/routes/adminRoute";
import LoginRoute from "./components/routes/loginRoute";
import MainRoute from "./components/routes/mainRoute";
import UserRoute from "./components/routes/userRoute";

// containers
import Drawer from "./containers/drawer";
import Main from "./containers/main";
import Login from "./containers/login";
import StudentData from "./containers/studentData";
import AdminLaserCutter from "./containers/admin_leichie";
import LaserCutter from "./containers/user_leichie";

import DP from "./containers/3dp";
import theme from "./theme";
// compononets
import Loading from "./components/loading";
// initialize, slices
import { init, selectSession } from "./slices/sessionSlice";

const Routes = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(init());
  }, []);
  const { initialized } = useSelector(selectSession);
  return !initialized ? (
    <Loading />
  ) : (
    <Switch>
      <MainRoute exact path="/">
        <Main />
      </MainRoute>
      <MainRoute exact path="/3dp">
        <DP />
      </MainRoute>
      <MainRoute exact path="/lasercutter">
        <LaserCutter />
      </MainRoute>
      <LoginRoute exact path="/login">
        <Login />
      </LoginRoute>
      <AdminRoute exact path="/studentdata">
        <StudentData />
      </AdminRoute>
      <AdminRoute exact path="/adminlasercutter">
        <AdminLaserCutter />
      </AdminRoute>
      <AdminRoute exact path="/lasercutter">
        <LaserCutter />
      </AdminRoute>
      <Redirect to="/login" />
    </Switch>
  );
};

export default function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Router>
          <Drawer>
            <Routes />
          </Drawer>
        </Router>
      </ThemeProvider>
    </div>
  );
}
