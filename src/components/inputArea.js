import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import firebase from "firebase/app";
import { database, storage } from "firebase";
import ApiKeys from "../config";
import { Detector } from "react-detect-offline";
import Replybar from "./replybar";
import { connect } from "react-redux";
import {
  InputBase,
  AppBar,
  ListItemIcon,
  IconButton,
  Toolbar,
  MenuItem,
  Menu,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField
} from "@material-ui/core";
import { Send, Movie, AddAPhoto, Attachment, Gif } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import RenderMessages from "./renderMessages";
import getDateTime from "./getDateTime";
const useStyles = makeStyles(theme => ({
  appbarHeight: theme.mixins.toolbar,
  text: {
    padding: theme.spacing(2, 2, 0)
  },
  paper: {
    paddingBottom: 50
  },
  list: {
    marginBottom: theme.spacing(2)
  },
  subheader: {
    backgroundColor: theme.palette.background.paper
  },
  appBar: {
    backgroundColor: "#424242",
    top: "auto",
    bottom: 0
  },
  appBarOffline: {
    backgroundColor: theme.secondary,
    top: "auto",
    bottom: 0
  },
  grow: {
    flexGrow: 1
  },
  messageInputBar: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    // marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },
  fileInput: {
    display: "none"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 1),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 600
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: 230
    }
  }
}));
function InputArea(props) {
  const classes = useStyles();
  if (!firebase.apps.length) {
    firebase.initializeApp(ApiKeys.FirebaseConfig);
  }
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [inputText, setInputText] = React.useState("");
  const [dialogsOpen, setDialogOpen] = React.useState(false);
  const [gifURL, setGifURL] = React.useState(null);

  const msgDB = database()
    .ref()
    .child(ApiKeys.FirebaseRef.messageDB);
  const mediaDB = database()
    .ref()
    .child(ApiKeys.FirebaseRef.mediaDB);
  var uploadsBucket = storage()
    .ref()
    .child(ApiKeys.FirebaseRef.storageBucket);
  let addIcon = document.getElementById("addIcon");
  function pushUploadMsg(mediaType, url) {
    if (!url) {
      return 0;
    }
    let message = {
      from: props.session.userName,
      hasMedia: true,
      mediaType: mediaType,
      at: getDateTime(),
      downURL: url
    };
    if (Object.keys(props.reply).length !== 0) {
      message.repliedTo = props.reply.isMedia
        ? {
            from: props.reply.from,
            isMedia: true,
            mediaType: props.reply.mediaType,
            downURL: props.reply.downURL
          }
        : {
            from: props.reply.from,
            text: props.reply.text
          };
      props.dispatch({ type: "RESET_REPLY" });
    }
    console.log(message);
    msgDB.push().set(message);
    mediaDB.push().set(message);
  }
  function handleUploads(e, mediaType) {
    let file = e.target.files[0];
    if (!file) {
      console.log("No File");
      return;
    }
    // Get a reference to store file at photos/<FILENAME>.jpg
    var uploadRef = uploadsBucket.child(
      file.type.split("/")[0] + "_" + getDateTime()
    );
    // Upload file to Firebase Storage
    var uploadTask = uploadRef.put(file);
    //uploadTask.on('state_changed', null, null, function() {
    uploadTask.on(
      "state_changed",
      function(snapshot) {
        addIcon.classList.add("upload");
        console.log("Upload Started");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
          default:
        }
      },
      function(error) {
        console.log("Upload Failed");
        addIcon.classList.remove("upload");
        window.alert("Upload Failed, Please Retry");
      },
      function() {
        console.log("Upload Completed");
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          addIcon.classList.remove("upload");
          pushUploadMsg(mediaType, downloadURL);
        });
      }
    );
  }
  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }
  function handleTextMessageSend() {
    if (inputText === "") {
      var reply = { text: "Empty Message" };
      props.dispatch({ type: "SET_REPLY", reply });
      setTimeout(() => props.dispatch({ type: "RESET_REPLY" }), 500);
    } else {
      let message = {
        from: props.session.userName,
        hasMedia: false,
        message: inputText,
        at: getDateTime()
      };
      if (Object.keys(props.reply).length !== 0) {
        message.repliedTo = props.reply.isMedia
          ? {
              from: props.reply.from,
              isMedia: true,
              mediaType: props.reply.mediaType,
              downURL: props.reply.downURL
            }
          : {
              from: props.reply.from,
              text: props.reply.text
            };
        props.dispatch({ type: "RESET_REPLY" });
      }
      msgDB.push().set(message);
      // console.log(message);
      setInputText("");
    }
  }
  function handleImageUploads(e) {
    handleUploads(e, "image");
  }
  function handleGifUpload() {
    if (!gifURL) {
      window.alert("Please Input the GIF");
    } else {
      pushUploadMsg("image", gifURL);
      setGifURL(null);
    }
  }
  function handleDocUploads(e) {
    handleUploads(e, "doc");
  }
  function handleVideoUploads(e) {
    handleUploads(e, "video");
  }
  return (
    <React.Fragment>
      <RenderMessages />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <input
            accept="image/*"
            className={classes.fileInput}
            id="contained-button-file-image"
            type="file"
            onChange={handleImageUploads}
          />
          <label htmlFor="contained-button-file-image">
            <ListItemIcon>
              <AddAPhoto />
            </ListItemIcon>
          </label>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <input
            accept="video/*"
            className={classes.fileInput}
            id="contained-button-file-video"
            type="file"
            onChange={handleVideoUploads}
          />
          <label htmlFor="contained-button-file-video">
            <ListItemIcon>
              <Movie />
            </ListItemIcon>
          </label>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon onClick={() => setDialogOpen(true)}>
            <Gif />
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <input
            // accept="file/*"
            className={classes.fileInput}
            id="contained-button-file-doc"
            type="file"
            onChange={handleDocUploads}
          />
          <label htmlFor="contained-button-file-doc">
            <ListItemIcon>
              <Attachment />
            </ListItemIcon>
          </label>
        </MenuItem>
      </Menu>
      <Dialog
        open={dialogsOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">GIF Input</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="gifInput"
            label="GIF"
            placeholder="Input GIF from keyboard"
            type="url"
            onChange={e => setGifURL(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setDialogOpen(false);
              handleGifUpload();
            }}
            color="primary"
          >
            Send GIF
          </Button>
        </DialogActions>
      </Dialog>
      <Detector
        render={({ online }) => (
          <AppBar
            position="fixed"
            color="primary"
            className={online ? classes.appBar : classes.appBarOffline}
          >
            <Replybar />
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="Open drawer"
                onClick={handleMenuClick}
              >
                <AddIcon id="addIcon" />
              </IconButton>
              <div className={classes.grow} />
              <div className={classes.messageInputBar}>
                <InputBase
                  multiline
                  placeholder="Message..."
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  inputProps={{ "aria-label": "Message" }}
                />
              </div>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleTextMessageSend}
              >
                <Send />
              </IconButton>
            </Toolbar>
          </AppBar>
        )}
      />
    </React.Fragment>
  );
}
function mapStateToProps(state) {
  return {
    session: state.session,
    reply: state.reply
  };
}
export default connect(mapStateToProps)(InputArea);
