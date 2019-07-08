import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  MenuItem,
  Menu,
  IconButton,
  Button,
  Typography,
  Toolbar,
  AppBar
} from "@material-ui/core/";
import ApiKeys from "../config";
import MenuIcon from "@material-ui/icons/Menu";
import { connect } from "react-redux";
import { database } from "firebase";
import md5 from "./md5";
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  bar: {
    backgroundColor: ApiKeys.customColors.chatboxBar
  }
}));

function Chatbox(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  function handleRemoveAll() {
    setAnchorEl(null);
    if (
      md5(window.prompt("Please Enter Your Password")) === ApiKeys.actual &&
      window.confirm("It can't be undone. Are you sure?")
    ) {
      let msgDB = database()
        .ref()
        .child(ApiKeys.FirebaseRef.messageDB);
      msgDB.remove(function(error) {
        if (!error) {
          //Success
          //Remount the RenderMessages
          console.log("Cleared");
          props.dispatch({ type: "DATA_CLEARED" });
        } else {
          //fail
          console.log(error);
        }
      });
    }
  }
  function handleClose() {
    setAnchorEl(null);
  }

  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }
  function handleLogout() {
    props.dispatch({ type: "RESET_STATE" });
  }
  return (
    <div className={classes.root}>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Media</MenuItem>
        <MenuItem onClick={handleClose}>
          <strong>As {props.session.userName}</strong>
        </MenuItem>
        <MenuItem onClick={handleRemoveAll}>RemoveAll</MenuItem>
      </Menu>
      <AppBar position="fixed" className={classes.bar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            ChatBox
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
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

/**
 * Exporting the Home Component and connecting it to the store
 * Bind the incoming data (session) to the state object of the home component
 */
export default connect(mapStateToProps)(Chatbox);
