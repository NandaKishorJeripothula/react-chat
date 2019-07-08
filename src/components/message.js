import React, { Component } from "react";
import {
  Info,
  Delete,
  Reply,
  CloudDownload,
  OpenInNew,
  FileCopy
} from "@material-ui/icons";
import {
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  ListItem,
  Grid,
  Typography,
  TextField
} from "@material-ui/core";
import { amber, green, deepOrange } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import RenderImage from "./renderImage";
import RenderVideo from "./renderVideo";
import { connect } from "react-redux";
const classes = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  orangeAvatar: {
    color: '#fff',
    backgroundColor: deepOrange[500],
  },
  // paper: {
  //   display: "flex",
  //   alignItems: "center",
  //   maxWidth: 200,
  //   overFlow: "hidden",
  //   fontSize: 5,

  // }
}));

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleReplyButton = () => {
    let reply = {};
    if (this.props.msg.hasMedia) {
      reply = {
        isMedia: true,
        mediaType: this.props.msg.mediaType,
        downURL: this.props.msg.downURL
      };
    } else {
      reply.text = this.props.msg.message;
    }
    reply.from = this.props.msg.from;
    // console.log(reply);

    this.props.dispatch({ type: "SET_REPLY", reply });
  };
  handleDeleteButton = () => {
    if (
      this.props.msg.from.split("")[0] === this.props.session.uChar &&
      window.confirm("Confirm?")
    ) {
      this.props.delete(this.props.msgKey);
    } else {
      window.alert("Its Not Urs");
    }
  };
  handleInfoButton = () => {
    window.alert("At " + this.props.msg.at);
  };
  render() {
    let avatar = null;
    if (this.props.msg.from.split("")[0] !== this.props.session.uChar) {
      avatar =
        <Avatar size="small" className={classes.orangeAvatar} component="span" >
          {this.props.msg.from.split("")[0]}
        </Avatar>
    } else {
      avatar = <Avatar size="small" component="span">
        {this.props.session.uChar}
      </Avatar>
    };
    let moreMenuIcons = this.props.msg.hasMedia ? (
      <span>
        <MenuItem onClick={this.handleClose}>
          <IconButton key="msgMenu" aria-label="menu" color="inherit">
            <a
              href={this.props.msg.downURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <OpenInNew className={classes.icon} />
            </a>
          </IconButton>
        </MenuItem>
        <MenuItem onClick={this.handleClose}>
          <IconButton key="msgMenu" aria-label="menu" color="inherit">
            <a href={this.props.msg.downURL} download target="_blank" rel="noopener noreferrer" >
              <CloudDownload className={classes.icon} />
            </a>
          </IconButton>
        </MenuItem>
      </span>
    ) : null;
    return (
      <ListItem disableGutters>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleClose}>
            <IconButton
              key="replyIcon"
              aria-label="reply"
              color="inherit"
              onClick={this.handleReplyButton}
            >
              <Reply className={classes.icon} />
            </IconButton>
          </MenuItem>
          <MenuItem onClick={this.handleClose}>
            <IconButton
              key="deleteIcon"
              aria-label="delete"
              color="inherit"
              onClick={this.handleDeleteButton}
            >
              <Delete className={classes.icon} />
            </IconButton>
          </MenuItem>
          {moreMenuIcons}
          <MenuItem onClick={this.handleClose}>
            <IconButton
              key="infoIcon"
              aria-label="info"
              color="inherit"
              onClick={this.handleInfoButton}
            >
              <Info className={classes.icon} />
            </IconButton>
          </MenuItem>
        </Menu>
        {/* */}
        <IconButton
          key="msgMenu"
          aria-label="menu"
          color="inherit"
          onClick={this.handleMenuClick}
        >
          {avatar}

        </IconButton>
        <div className="message">
          <Grid container wrap="nowrap" >
            <Grid item>
              <span id="repliesHandlers">
                {this.props.msg.repliedTo && this.props.msg.repliedTo.text && (
                  <TextField
                    disabled
                    multiline
                    id="filled-disabled"
                    label={this.props.msg.repliedTo.from}
                    defaultValue={this.props.msg.repliedTo.text}
                    className={classes.textField}
                    margin="normal"
                    InputProps={{
                      readOnly: true
                    }}
                    variant="filled"
                  />
                )}
                {this.props.msg.repliedTo &&
                  this.props.msg.repliedTo.isMedia &&
                  this.props.msg.repliedTo.mediaType === "image" && (
                    <RenderImage src={this.props.msg.repliedTo.downURL} />
                  )}
                {this.props.msg.repliedTo &&
                  this.props.msg.repliedTo.isMedia &&
                  this.props.msg.repliedTo.mediaType === "video" && (
                    <RenderVideo src={this.props.msg.repliedTo.downURL} />
                  )}
                {this.props.msg.repliedTo &&
                  this.props.msg.repliedTo.isMedia &&
                  this.props.msg.repliedTo.mediaType === "doc" && (
                    <FileCopy />
                  )}
              </span>
              <div>
                {this.props.msg.hasMedia &&
                  this.props.msg.mediaType === "image" && (
                    <RenderImage src={this.props.msg.downURL} />
                  )}
                {this.props.msg.hasMedia &&
                  this.props.msg.mediaType === "video" && (
                    <RenderVideo src={this.props.msg.downURL} />
                  )}
                {this.props.msg.hasMedia &&
                  this.props.msg.mediaType === "doc" && (
                    <FileCopy />
                  )}
              </div>
              <Typography>{this.props.msg.message}</Typography>
            </Grid>
            {/* <Grid item>
              <IconButton
                key="msgMenu"
                aria-label="menu"
                color="inherit"
                onClick={this.handleMenuClick}
              >
                <Avatar size="small" component="span">
                  {this.props.session.uChar}
                </Avatar>
                <MoreVertIcon className={classes.icon} />
              </IconButton>
            </Grid> */}
          </Grid>
        </div>
        {/* {this.props.msg.from.split("")[0] === this.props.session.uChar && (
          <IconButton
            key="msgMenu"
            aria-label="menu"
            color="inherit"
            onClick={this.handleMenuClick}
          >
            <Avatar size="small" component="span">
              {this.props.session.uChar}
            </Avatar>
            <MoreVertIcon className={classes.icon} />
          </IconButton>
        )} */}
      </ListItem>
    );
  }
}

function mapStateToProps(state) {
  return {
    session: state.session,
    reply: state.reply
  };
}
export default connect(mapStateToProps)(Message);
