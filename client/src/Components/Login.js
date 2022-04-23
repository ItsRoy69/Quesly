import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import bg1 from "../Images/bg1.jpg";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "../Firebase";
import { useHistory } from "react-router-dom";
import "../Styles/Login.css";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Quesly
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Login() {
  const history = useHistory();

  const [remember, setRemember] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [loader, setLoader] = useState(false);

  const [loguser, setLogUser] = useState({
    email: "",
    password: "",
  });

  let name, value;

  const inputsHandler = (e) => {
    name = e.target.name;
    value = e.target.value;

    setLogUser({ ...loguser, [name]: value });
  };

  const signIn = async (e) => {
    e.preventDefault();

    const { email, password } = loguser;

    const data = { email, password };

    setLoader(true);

    await axios
      .post("https://quesly-backend.herokuapp.com/login", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response);
        setAuthToken(response.data);
        if (remember) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user_info", JSON.stringify(response.data.user));
        } else {
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem(
            "user_info",
            JSON.stringify(response.data.user)
          );
        }
        window.location.reload(false);
      })
      .finally(() => {
        setLoader(false);
      })
      .catch((e) => {
        alert("Log in failed");
        console.log(e);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      {loader ? <div className="loaderLogin"></div> : null}
      <img
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        src={bg1}
      />
      <Container
        component="main"
        maxWidth="xs"
        style={{
          position: "absolute",
          top: "50%",
          transform: "translate(-50%,-50%)",
          padding: "2rem",
          left: "50%",
          background: "rgba(255, 255, 255, 0.904)",
          borderRadius: "10px",
          boxShadow: " 0px 2px 48px -4px rgba(0,0,0,0.73)",
          overflow: "hidden",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button className="gbtn" onClick={signInWithGoogle}>
            <FcGoogle />
            Sign In with Google{" "}
          </button>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate method="POST" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="off"
              autoFocus
              onChange={inputsHandler}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="off"
              onChange={inputsHandler}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              onClick={() => setRemember(!remember)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={signIn}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register" style={{ cursor: "pointer" }}>
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
