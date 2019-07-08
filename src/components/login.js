import React, { useState } from "react";
import firebase from "firebase/app";
import {
  Container,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Avatar,
  Typography
} from "@material-ui/core";
import { connect } from "react-redux";
import md5 from "./md5";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import ApiKeys from "../config";

const useStyles = makeStyles(theme => ({
  card: {},
  avatar: {
    margin: "auto",
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function Login(props) {
  if (!firebase.apps.length) {
    firebase.initializeApp(ApiKeys.FirebaseConfig);
  }
  const classes = useStyles();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleLogin = e => {
    e.preventDefault();
    if (!userName || !password) {
      //This will never be called until default validation fails
      setErrorMessage("Invalid UserName/ Password");
    } else if (md5(password) === ApiKeys.actual) {
      var session = {
        userName: userName,
        uChar: userName.split("")[0],
        time: new Date()
      };
      props.dispatch({ type: "SET_SESSION", session });
      console.log("login");
    } else {
      setErrorMessage("Invalid UserName/ Password");
    }
  };
  return (
    <div className="login">
      <Container maxWidth="sm">
        <Card className={classes.card}>
          <form onSubmit={handleLogin}>
            <CardContent>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                ChatBox
              </Typography>
              <TextField
                onChange={e => {
                  setUserName(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                value={userName}
                className="loginInputs"
                required
                id="outlined-uncontrolled"
                label="User Name"
                placeholder="User Name"
                margin="normal"
                variant="outlined"
                style={{ width: 300 }}
              />
              <br />
              <TextField
                required
                onChange={e => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                value={password}
                className="loginInputs"
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
                style={{ width: 300 }}
              />
              <Typography>{errorMessage}</Typography>
            </CardContent>
            <CardActions>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ width: "90%", marginLeft: 50, marginRight: 50 }}
              >
                Login
              </Button>
            </CardActions>
          </form>
        </Card>
      </Container>
    </div>
  );
}
function mapStateToProps(state) {
  return {
    /**
     * This state object is taken from the store
     * session curresponds to the session attribute in initial state
     */
    session: state.session
  };
}

/*
 * Exporting the Home Component and connecting it to the store
 * Bind the incoming data (session) to the state object of the home component
 */
export default connect(mapStateToProps)(Login);
