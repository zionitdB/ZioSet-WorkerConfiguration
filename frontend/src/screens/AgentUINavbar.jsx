import React, { useContext, useEffect, useState } from "react";
import "../css/Navbar.css";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../utils/DarkModeContext";
import logo from "../img/logo.png";
import Tooltip from "@mui/material/Tooltip";
import LogoutIcon from "@mui/icons-material/Logout";

function AgentUINavbar() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [userDetails, setUserDetails] = useState(null);
  const [showDarkModeWave, setShowDarkModeWave] = useState(false);

  useEffect(() => {
    // Retrieve user details from local storage
    const storedUserDetails = sessionStorage.getItem("agentUser");
    //
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }
  }, []);

  const handleToggleDarkMode = () => {
    toggleDarkMode();
    setShowDarkModeWave(true);
  };

  useEffect(() => {
    // Apply dark mode styles when component mounts or dark mode state changes
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    // Save dark mode preference to local storage
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);
  return (
    <div>
      <nav className="navbar" style={{ height: "60px" }}>
        {/* Overlay for dark mode wave animation */}
        {showDarkModeWave && <div className="dark-mode-overlay"></div>}

        <div className="logo_item">
          <i className="bx bx-menu" id="sidebarOpen"></i>
          <img src={logo} alt="" />
        </div>

        <div></div>
        <div className="navbar_content">
          {userDetails ? (
            <div className="content-center text-center">
              <p style={{ color: "var(--grey-color)" }}>
                Welcome {userDetails.firstName} {userDetails.lastName}
              </p>
            </div>
          ) : (
            <p>Loading user details...</p>
          )}

          {/* <button onClick={toggleDarkMode}>Dark</button> */}
          <i className="bi bi-grid"></i>
          {/* for light and dark mode */}
          <i className="bx bx-sun" id="darkLight"></i>
          {/* <i className='bx bx-bell'></i> */}
          <Tooltip title="Toggle Dark Mode">
            {isDarkMode ? (
              <Brightness7Icon onClick={handleToggleDarkMode} id="darkLight" />
            ) : (
              <Brightness4Icon onClick={handleToggleDarkMode} id="darkLight" />
            )}
          </Tooltip>

          <Link to="/Notification">
            <Tooltip title="Notifications">
              {/* <NotificationsNoneIcon /> */}
            </Tooltip>
          </Link>

          <Tooltip title="Log out">
            <LogoutIcon
              color="warning"
              fontSize="24px"
              onClick={() => {
                localStorage.removeItem("agentUser");
                sessionStorage.clear("agentUser");
                navigate("/app/login");
              }}
            />
          </Tooltip>

        </div>
      </nav>
    </div>
  );
}

export default AgentUINavbar;
