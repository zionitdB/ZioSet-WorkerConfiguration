import React, { createContext, useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const DarkModeContext = createContext();

const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const darkMode = localStorage.getItem("darkMode");
    return darkMode ? JSON.parse(darkMode) : true;
  });
  const [isReloading, setIsReloading] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    // Set isReloading to true to trigger the loading indicator
    setIsReloading(true);
    // Save the new mode in local storage
    localStorage.setItem("darkMode", JSON.stringify(!isDarkMode));
    // Reload the page after a short delay to allow the loading indicator to show
    setTimeout(() => {
      window.location.reload();
    }, 500); // Adjust the delay as needed
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {/* Conditionally render the loading spinner */}
      {isReloading && (
        <div className="loading-overlay">
          <CircularProgress />
        </div>
      )}
      {children}
    </DarkModeContext.Provider>
  );
};

export { DarkModeContext, DarkModeProvider };
