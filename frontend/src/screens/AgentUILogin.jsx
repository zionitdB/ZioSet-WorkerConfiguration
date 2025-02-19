import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "../css/Login.css";
import {  useNavigate } from "react-router-dom";
import { ToastTypes, showToast } from "../utils/toast";
import { AgentUIAuthProvider,useAgentUILoginAuth } from "../utils/AgentUIAuthContext";
import { postAgentRequest } from "../services/agentUIServiceApi";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      style={{ color: "black" }}
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://zionit.in/" target="_blank">
        Zionit Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

 function AgentUILogin() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  const { dispatch } = useAgentUILoginAuth();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    // Basic form validation
    if (!username || !password) {
      showToast("Username and password are required", ToastTypes.error);
      return;
    } 

    let url = "access/login";
    

    const { data: responseData, error } = await postAgentRequest(url, {
      username: username,
      password: password,
    }); 
    
    // Assuming you meant to use responseData instead of response
    if (responseData.code === 200) {
      // Successful login, you can handle the response here
      
      
      showToast("Login successful", ToastTypes.success);
      dispatch({ type: "LOGIN", payload: responseData.data });

      // Store user information in local storage
      sessionStorage.setItem("agentUser", JSON.stringify(responseData.data));
      navigate("/app/Dashboard");
    } else {
      // Handle error response
      setError("Invalid username or password");
      showToast(responseData.message, ToastTypes.error);
      console.error("Login failed:", error);
    }
  };

  return (
    <div style={{overflow: 'hidden'}}>
    <AgentUIAuthProvider>
      <ThemeProvider theme={defaultTheme}>
        <Grid
          className="login-container"
          container
          component="main"
          sx={{ height: "100vh" }}
        >
          <CssBaseline />
          <Grid
            className="login-box1"
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              // backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            className="login-box2"
            item
            xs={12}
            sm={8}
            md={5}
            elevation={6}
            square
          >
            <Box
              className="login-box"
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" style={{color : 'black'}}>
                Agent User Sign in
              </Typography>
              <Box
                component="form"
                Validate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="User Name"
                  name="username"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleTogglePasswordVisibility}
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel
      control={<Checkbox value="remember" color="primary" />}
      label="Remember me"
      style={{ color: "black" }} 
    />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      {/* Forgot password? */}
                    </Link>
                  </Grid>

                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </AgentUIAuthProvider>
    </div>
  );
}

export default AgentUILogin