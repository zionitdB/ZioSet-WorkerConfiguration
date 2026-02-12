import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";

export default function AccountMenu() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user details from local storage
    const storedUserDetails = sessionStorage.getItem("userDetails");
    //
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }
  }, []);

  const getUserLocation = (userDetails) => {
    if (
      userDetails &&
      userDetails.locations &&
      userDetails.locations.length > 0
    ) {
      return userDetails.locations
        .map((location) => location.locationName)
        .join(", ");
    }
    return "Unknown Location";
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  //   document.body.style.overflow = "hidden"; // Hide main scrollbar
  //   document.body.style.position = "fixed"; // Prevent body from resizing
  // };

  const handleLogout = () => {
    // Clear local storage
    // sessionStorage.removeItem("userDetails");
    // sessionStorage.removeItem("user");
    // sessionStorage.removeItem("userLocation");
    // sessionStorage.removeItem("VisibleColumns");
    // sessionStorage.removeItem("InventoryTable");
    // sessionStorage.removeItem("token");
    localStorage.clear();

    // Dispatch logout action
    dispatch({ type: "LOGOUT" });

    // Navigate to the login page
    navigate("/app/login");
  };

  // const handleClose = () => {
  //   setAnchorEl(null);
  //   document.body.style.overflow = "auto"; // Revert back to auto when menu is closed
  //   document.body.style.position = "relative"; // Allow body resizing
  // };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    const parentContainer = event.currentTarget.closest(
      ".account-menu-container"
    );
    if (parentContainer) {
      parentContainer.style.overflow = "hidden"; // Hide scrollbar for parent container
      parentContainer.style.position = "fixed"; // Prevent parent container from resizing
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    const parentContainer = document.querySelector(".account-menu-container");
    if (parentContainer) {
      parentContainer.style.overflow = "auto"; // Revert back to auto when menu is closed
      parentContainer.style.position = "relative"; // Allow parent container resizing
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            {userDetails && userDetails.firstName && userDetails.lastName ? (
              <Avatar sx={{ width: 32, height: 32 }}>
                <p>{userDetails.firstName.charAt(0)}</p>
                <p>{userDetails.lastName.charAt(0)}</p>
              </Avatar>
            ) : (
              <Avatar />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* ... (existing menu items) */}
        <Link to="/Profile">
          <MenuItem>
            <Avatar /> Profile
          </MenuItem>
        </Link>
        <Link onClick={handleLogout}>
          <MenuItem>
            <Logout /> Logout
          </MenuItem>
        </Link>
        {/* <Link onClick={handleLogout} >
          <MenuItem>
          <Logout /> Logout
          </MenuItem>
        </Link> */}

        {/* <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem> */}
        <Divider />
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem> */}
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
        {/* <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="" />
          </ListItemIcon>
          Logout
        </MenuItem> */}
      </Menu>
    </React.Fragment>
  );
}
