import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, IconButton, Toolbar } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
const useStyles = makeStyles(theme => ({
  replyBar: theme.mixins.toolbar,
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    padding: theme.spacing(1, 1, 1, 1),
    transition: theme.transitions.create("width"),
    width: "70%",
    [theme.breakpoints.up("md")]: {
      width: 500
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: 140
    }
  }
}));
function Replybar(props) {
  const classes = useStyles();
  if (Object.keys(props.reply).length !== 0) {
    return (
      <Toolbar>
        <TextField
          disabled
          multiline
          id="filled-disabled"
          label={props.reply.from}
          defaultValue={
            props.reply.isMedia ? props.reply.mediaType : props.reply.text
          }
          className={classes.textField}
          margin="normal"
          InputProps={{
            readOnly: true
          }}
          variant="filled"

        />
        <IconButton
          edge="end"
          key="clearIcon"
          aria-label="clearReply"
          color="inherit"
          onClick={() => props.dispatch({ type: "RESET_REPLY" })}
        >
          <Clear />
        </IconButton>
      </Toolbar>
    );
  } else {
    return <div />;
  }
}

function mapStateToProps(state) {
  return {
    /**
     * This state object is taken from the store
     * session curresponds to the session attribute in initial state
     */
    reply: state.reply
  };
}
export default connect(mapStateToProps)(Replybar);
