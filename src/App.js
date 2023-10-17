import React, { lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";

import { useSelector } from "react-redux";
import Protected from "./components/Auth/Protected";
import UnAuthenticated from "./components/Auth/UnAuthenticated";

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));

function App() {
  // get current user from redux

  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <Route
            path="/login"
            element={
              <UnAuthenticated>
                <Login />
              </UnAuthenticated>
            }
          />

          <Route
            path="/create-account"
            element={
              <UnAuthenticated>
                <CreateAccount />
              </UnAuthenticated>
            }
          />

          {/* Protected route */}

          <Route
            path="/app/"
            element={
              <Protected>
                <Layout />
              </Protected>
            }
          />

          <Route
            path="*"
            element={
              <UnAuthenticated>
                <Login />
              </UnAuthenticated>
            }
          />
        </Switch>
      </Router>
    </>
  );
}

export default App;
