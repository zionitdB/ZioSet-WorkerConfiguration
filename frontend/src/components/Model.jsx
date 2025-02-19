import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from '@mui/icons-material/Close';
import { useSpring, animated } from 'react-spring';

const CustomModal = (props) => {
  const {
    open,
    handleClose,
    contentTitle,
    contentDescription,
  } = props;

  const modalAnimation = useSpring({
    opacity: open ? 1 : 0,
    transform: open ? 'scale(1)' : 'scale(0)', // Zoom in and out animation
    config: { tension: 200, friction: 20 }, // Adjust tension and friction for the animation
    // boxShadow: open ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : 'none', // Extra shadow effect
    // borderRadius: open ? '8px' : '0px', // Extra border radius animation
  });
  
  
  

  const modalStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--grey-color)',
  };

  // Define the initial modal content style
  let initialModalContentStyle = {
    ...modalAnimation,
    position: 'relative',
    maxHeight: "80vh",
    overflowY: "auto",
    width: "80vw",
    bgcolor: 'white', // Set background color to white
    boxShadow: 24,
  };

  const headerStyle = {
    position: "sticky",
    top: 0,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Fallback background color with opacity
    backdropFilter: "blur(10px)", // Apply backdrop blur effect
    WebkitBackdropFilter: "blur(10px)", // Fallback for older versions of Safari
    color: "var(--modal-header-color-light)", // Assuming light mode text color
    padding: "16px",
    borderBottom: "1px solid #000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  };
  

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="custom-modal-title"
      aria-describedby="custom-modal-description"
      style={modalStyle}
      
    >
      <animated.div style={{ ...initialModalContentStyle }} className="container">
        <Box sx={headerStyle}>
          <Typography id="custom-modal-title" variant="h6" component="h2">
            {contentTitle}
          </Typography>
          <Button onClick={handleClose}>
            <CloseIcon />
          </Button>
        </Box>
        <Typography id="custom-modal-description" sx={{ mt: 2 }}>
          {contentDescription}
        </Typography>
      </animated.div>
    </Modal>
  );
};

export default CustomModal;
