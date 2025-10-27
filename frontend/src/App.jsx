import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import ErrorPage from "./utils/ErrorPage";
import AgentUIErrorPage from "./utils/AgentUIErrorPage";
import RedirectPage from "./utils/RedirectCountComponent";
import AgentUIRedirectPage from "./utils/AgentUIRedirectPage";

import NavbarProvider from "./provider/NavbarProvider";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSpring, animated } from "react-spring";

import { useNavigate } from "react-router-dom";

import { useAgentUILoginAuth } from "./utils/AgentUIAuthContext";
import AgentUILogin from "./screens/AgentUILogin";
import AgentUIDashboard from "./screens/AgentUIDashboard";
import AgentUISidenav from "./screens/AgentUISidenav";
import AgentUICategory from "./screens/Category/AgentUICategory";
import Actions from "./screens/Actions/Actions";
import CommandConfig from "./screens/CommandConfiguration/CommandConfig";
import AgentUINavbar from "./screens/AgentUINavbar";
import TreeViewPage from "./screens/Category/TreeViewPage";
import GroupCommandScreen from "./screens/CommandGroups/GroupCommandScreen";
import StandaloneApplicationScreen from "./screens/StandaloneApplications/StandaloneApplicationScreen";
import AgentUpdatesScreen from "./screens/AgentUpdates/AgentUpdatesScreen";
import AgentUpdatesTargetSystemsScreen from "./screens/AgentUpdatesTargetSystems/AgentUpdatesTargetSystemsScreen";
import WindowsInstalledSystemsScreen from "./screens/WindowsInstalledSystems/WindowsInstalledSystemsScreen";
import MacInstalledSystemsScreen from "./screens/MacInstalledSystems/MacInstalledSystemsScreen";
import UnRegisteredAssetsScreen from "./screens/UnRegisteredAssets/UnRegisteredAssetsScreen";

function App() {
  // Light theme
  const lightTheme = createTheme({
    palette: {
      mode: "light",
    },
  });

  // Dark theme
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <div>
      {/* ... */}
      <ThemeProvider
        theme={
          document.body.classList.contains("dark") ? darkTheme : lightTheme
        }
      >
        <Router>
          <LocationAwareApp />
        </Router>
        <ToastContainer />
      </ThemeProvider>
    </div>
  );
}

const AgentUIPrivateRoute = ({ children }) => {
  const { state: agentAuthState, dispatch } = useAgentUILoginAuth();

  if (!agentAuthState.isAuthenticated) {
    dispatch({ type: "INCREMENT_REDIRECT_COUNT" }); // Increment redirect count
    return <Navigate to="/app/redirect" />;
  }
  return children;
};

function LocationAwareApp() {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { tension: 300, friction: 20, duration: 200 },
  });

  const location = useLocation();
  const isLoginPage =
    location.pathname === "/ErrorPage" ||
    location.pathname === "/app/login" ||
    location.pathname === "/app/ErrorPage" ||
    location.pathname === "/app/redirect" ||
    location.pathname === "*";

  const isAgentScreen =
    location.pathname.startsWith("/app/") &&
    location.pathname !== "/app/login" &&
    location.pathname !== "/app/redirect";

  const [showModal, setShowModal] = useState(false);
  const [inactiveTime, setInactiveTime] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the title from the current route
    const routeTitle = getRouteTitle(location.pathname);

    // Set the document title
    document.title = `Zionit - ${routeTitle}`;
  }, [location.pathname]);

  function getRouteTitle(pathname) {
    const routeParts = pathname.split("/");
    const lastRoutePart = routeParts[routeParts.length - 1];

    // Capitalize the first letter of the last route part
    const capitalizedRoutePart =
      lastRoutePart.charAt(0).toUpperCase() + lastRoutePart.slice(1);

    return capitalizedRoutePart || "Zionit"; // Fallback to 'Zionit' if the route is empty
  }

  const resetInactiveTime = () => {
    setInactiveTime(0);
  };

  useEffect(() => {
    const handleUserActivity = () => {
      resetInactiveTime();
      setShowModal(false);
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowModal(true);
      startCountdown();
    }, 6000000); // Show modal after 1 minute of inactivity

    return () => clearTimeout(timeoutId);
  }, [inactiveTime]);

  const startCountdown = () => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(intervalId);
          navigateToLogin();
        }
        return prevCountdown - 1;
      });
    }, 1000); // Update countdown every second
  };

  const navigateToLogin = () => {
    // Navigate to login page
    navigate("/app/login");
  };
  useEffect(() => {
    if (countdown === 0) {
      navigateToLogin();
    }
  }, [countdown]);

  // Light theme
  const lightTheme = createTheme({
    palette: {
      mode: "light",
      // Add your light mode palette colors here
    },
  });

  // Dark theme
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      // Add your dark mode palette colors here
    },
  });

  return (
    <>
      <ThemeProvider
        theme={
          document.body.classList.contains("dark") ? darkTheme : lightTheme
        }
      >
        {isAgentScreen && (
          <NavbarProvider>
            <AgentUINavbar />
            <AgentUISidenav />
          </NavbarProvider>
        )}

        <animated.div
          className={isLoginPage ? "" : "Overview-home"}
          style={props}
        >
          <div>
            <Routes>
              {/* Root route redirecting to /app/Dashboard */}
              <Route
                path="/"
                element={<Navigate to="/app/Dashboard" replace />}
              />
              <Route
                exact
                path="/app/Dashboard"
                element={
                  <AgentUIPrivateRoute>
                    <AgentUIDashboard />
                  </AgentUIPrivateRoute>
                }
              />
              <Route
                exact
                path="/app/Category"
                element={
                  <AgentUIPrivateRoute>
                    <AgentUICategory />
                  </AgentUIPrivateRoute>
                }
              />
              <Route
                exact
                path="/app/Actions"
                element={
                  <AgentUIPrivateRoute>
                    <Actions />
                  </AgentUIPrivateRoute>
                }
              />
              <Route
                exact
                path="/app/CommandConfiguration"
                element={
                  <AgentUIPrivateRoute>
                    <CommandConfig />
                  </AgentUIPrivateRoute>
                }
              />
              <Route
                exact
                path="/app/CategoriesTreeView"
                element={
                  <AgentUIPrivateRoute>
                    <TreeViewPage />
                  </AgentUIPrivateRoute>
                }
              />
              <Route
                exact
                path="/app/commands-groups"
                element={
                  <AgentUIPrivateRoute>
                    <GroupCommandScreen />
                  </AgentUIPrivateRoute>
                }
              />
              <Route
                exact
                path="/app/standalone-applications"
                element={
                  <AgentUIPrivateRoute>
                    <StandaloneApplicationScreen />
                  </AgentUIPrivateRoute>
                }
              />

              <Route
                exact
                path="/app/agent-updates"
                element={
                  <AgentUIPrivateRoute>
                    <AgentUpdatesScreen />
                  </AgentUIPrivateRoute>
                }
              />

              <Route
                exact
                path="/app/targetSystems"
                element={
                  <AgentUIPrivateRoute>
                    <AgentUpdatesTargetSystemsScreen />
                  </AgentUIPrivateRoute>
                }
              />
              <Route
                exact
                path="/app/windowsInstalledSystems"
                element={
                  <AgentUIPrivateRoute>
                    <WindowsInstalledSystemsScreen/>
                  </AgentUIPrivateRoute>
                }
              />

              <Route
                exact
                path="/app/macInstalledSystems"
                element={
                  <AgentUIPrivateRoute>
                    <MacInstalledSystemsScreen/>
                  </AgentUIPrivateRoute>
                }
              />

              <Route
                exact
                path="/app/unregisteredAssets"
                element={
                  <AgentUIPrivateRoute>
                    <UnRegisteredAssetsScreen />
                  </AgentUIPrivateRoute>
                }
              />

              <Route path="/ErrorPage" element={<ErrorPage />} />
              <Route path="/app/ErrorPage" element={<AgentUIErrorPage />} />

              <Route path="/app/login" element={<AgentUILogin />} />
              <Route
                exact
                path="/app/redirect"
                element={
                  <AgentUIRedirectPage
                    redirectTo="/app/login"
                    countdownDuration={3}
                  />
                }
              />
              <Route
                path="*"
                element={
                  <RedirectPage redirectTo="/ErrorPage" countdownDuration={0} />
                }
              />
            </Routes>
          </div>
        </animated.div>
      </ThemeProvider>
    </>
  );
}
export default App;
