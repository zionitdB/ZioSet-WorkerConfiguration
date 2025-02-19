import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSpring, animated } from 'react-spring';

export default function BasicButtons(props) {
  const { variant, color, value, starIcon, style, onClick, className, disabled } = props;

  // Define hover and active animations
  const hoverAnimation = useSpring({ scale: 1 });
  const activeAnimation = useSpring({ scale: 0.9 });

  // Check if body has the 'dark' class
  const isDarkMode = document.body.classList.contains('dark');

  // Conditionally add class based on dark mode
  const darkClassName = isDarkMode ? 'dark-button' : '';

  // Light theme
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      // Add your light mode palette colors here
    },
  });

  // Dark theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      // Add your dark mode palette colors here
    },
  });

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Stack spacing={2} direction="row">
        <animated.div
          onMouseEnter={() => hoverAnimation.scale.set(1.1)}
          onMouseLeave={() => hoverAnimation.scale.set(1)}
          onMouseDown={() => activeAnimation.scale.set(0.9)}
          onMouseUp={() => activeAnimation.scale.set(1)}
          style={{
            cursor: 'pointer',
            transform: hoverAnimation.scale.interpolate(scale => `scale(${scale})`),
          }}
        >
          <Button
            className={`${className} ${darkClassName}`} // Add darkClassName here
            variant={variant}
            color={color}
            startIcon={starIcon}
            style={style}
            onClick={onClick}
            disabled={disabled}
          >
            {value}
          </Button>
        </animated.div>
      </Stack>
    </ThemeProvider>
  );
}
