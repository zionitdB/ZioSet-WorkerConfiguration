import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import FormInput from "./FormInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function VirtualizedList({ items, onClick }) {
  const [filter, setFilter] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleDarkModeChange = () => {
      const bodyClasses = document.body.classList;
      const isDarkMode = bodyClasses.contains("dark");
      setDarkMode(isDarkMode);
    };

    // Check the initial dark mode state
    handleDarkModeChange();

    // Listen for changes in the body class
    document.body.addEventListener("transitionend", handleDarkModeChange);

    return () => {
      // Cleanup: remove event listener
      document.body.removeEventListener("transitionend", handleDarkModeChange);
    };
  }, []);

  const filteredItems = items.filter((item) => {
    return (
      item.label && item.label.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const handleInputChange = (e) => {
    setFilter(e.target.value);
  };

  const handleItemClick = (label, index) => {
    setSelectedIndex(index);
    onClick(label);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        width: 320,
        bgcolor: darkMode ? "dark.background" : "background.paper",
      }}
    >
      <FormInput
        label="Search"
        onChange={handleInputChange}
        htmlFor="searchInput"
        isRequired={true}
        data-required={true}
        type="text"
        placeholder=""
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton size="small">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <div className="virtual-list-item">
        {filteredItems.map((item, index) => {
          const isSelected = selectedIndex === index;
          return (
            <ListItem
              key={index}
              style={{
                backgroundColor: isSelected
                  ? (darkMode ? "#1a237e" : "blue")
                  : "transparent",
                color: isSelected ? "white" : darkMode ? "white" : "black",
              }}
              component="div"
              disablePadding
            >
              <ListItemButton>
                <ListItemText
                  primary={item.count ? `${item?.label} (Licence - ${item?.count})`: `${item?.label}`}
                  onClick={() => handleItemClick(item?.label, index)}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </div>
      <div
        className="NoResult"
        style={{ position: "absolute", top: 100, left: 20 }}
      >
        {filteredItems.length === 0 && <div><p>No results found </p></div>}
      </div>
    </Box>
  );
}
