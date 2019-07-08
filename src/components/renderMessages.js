import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { database } from "firebase";
import ApiKeys from "../config";
import Message from "./message";
import { List } from "@material-ui/core";
import { connect } from "react-redux";

const useStyles = makeStyles(theme => ({
  appbarHeight: theme.mixins.toolbar,
  text: {
    padding: theme.spacing(2, 2, 0)
  },
  paper: {
    paddingBottom: "50px"
  },
  list: {},
  subheader: {
    backgroundColor: theme.palette.background.paper
  },
  grow: {
    flexGrow: 1
  }
}));

const classes = useStyles;
class RenderMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // loading: true,
      msgs: [],
      msgDB: database()
        .ref()
        .child(ApiKeys.FirebaseRef.messageDB)
    };
    this.MessagesList = React.createRef();
  }

  scrollToBottom = () => {
    // console.log(this.MessagesList);
    this.MessagesList.scrollIntoView({ behavior: "smooth" });
  };
  componentDidUpdate() {
    this.scrollToBottom();
    if (this.props.chatCleared) {
      this.setState({ msgs: [] });
      this.props.dispatch({ type: "RELOADED" });
    }
  }
  componentDidMount = () => {
    this.scrollToBottom();
    // this.setState({ loading: true });
    this.state.msgDB.on("child_added", snapshot => {
      // this.setState({msgs:this.state.msgs.con})
      // console.log({ key: snapshot.key, data: snapshot.val() });
      this.setState({
        msgs: [...this.state.msgs, { key: snapshot.key, data: snapshot.val() }]
      });
    });
  };
  componentWillUnmount = () => {
    this.state.msgDB.off();
  };
  handleDeleteMessage = msgKey => {
    this.state.msgDB.child(msgKey).remove();
    this.setState(prevState => ({
      msgs: prevState.msgs.filter(i => i.key !== msgKey)
    }));
  };

  render() {
    let msgsList = this.state.msgs.map(msg => {
      return (
        <Message
          key={msg.key}
          msgKey={msg.key}
          msg={msg.data}
          delete={this.handleDeleteMessage}
        />
      );
    });
    return (
      <div
        className={classes.paper}
        style={{
          marginBottom: "50px",
          marginTop: "50px"
        }}
      >
        {/* {this.state.loading && <CircularProgress />} */}

        {/* <Typography className={classes.text} variant="h5" gutterBottom>
                    Inbox
            </Typography> */}
        <List className={classes.list} disablePadding dense={true}>
          {msgsList}
        </List>
        <div
          className={classes.appbarHeight}
          ref={e => (this.MessagesList = e)}
        />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    chatCleared: state.chatCleared,
    lastSeen_n: state.lastSeen_n,
    lastSeen_b: state.lastSeen_b
  };
}
export default connect(mapStateToProps)(RenderMessages);
