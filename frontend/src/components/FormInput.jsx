import React from "react";
import "./css/FormInput.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function FormInput({
  htmlFor,
  label,
  value,
  onChange,
  isRequired,
  "data-required": dataRequired,
  onClick,
  placeholder,
  type,
  style,
  error,
  helperText,
  disabled, // Add the disabled prop here
  shouldAutoFocus,
  min
}) {
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
    <ThemeProvider
      theme={document.body.classList.contains("dark") ? darkTheme : lightTheme}
    >
      <div className="flex-basis-50">
        <form action="">
          <div className="form-row">
            <div className="input-data">
              {/* {label} {isRequired && <span style={{ color: 'red' }}>*</span>} */}
              <input
                data-required={isRequired}
                required
                onChange={onChange}
                onClick={onClick}
                placeholder={placeholder}
                type={type}
                value={value}
                min={min}
                // style={style}
                disabled={disabled}
                autoFocus={shouldAutoFocus}
              />
              {error && <p style={{ color: "red" }}>{helperText}</p>}
              {isRequired ? (
                <div className="underline1"></div>
              ) : (
                <div className="underline"></div>
              )}
              <label htmlFor={htmlFor}>
                {isRequired && <span style={{ color: "red" }}></span>}
                {label}
              </label>
            </div>
          </div>
        </form>
      </div>
    </ThemeProvider>
  );
}

export default FormInput;
