import React, { Component } from "react";
import { Paper } from "@material-ui/core";
import ApiKeys from '../config'
import Chatbox from "./chatbox";
import InputArea from './inputArea';
import * as firebase from 'firebase';
export default class Wrapper extends Component {
  componentDidMount = async () => {
    if (!firebase.apps.length) {
      firebase
        .initializeApp(ApiKeys.FirebaseConfig);
    }
  }
  render() {
    return (
      <Paper
        style={{
          flex: 2,
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "space-between",
          margin: 10,
          backgroundColor: ApiKeys.customColors.wrapperPaper,
          width: "100%"
        }}
      >
        <Chatbox />
        {/* <Card>
          <CardContent />
        </Card>
        <Card>
          <CardContent />
        </Card> */}
        <InputArea />
      </Paper>
    )
  };
}
