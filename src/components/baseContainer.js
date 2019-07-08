import React from "react";
import { connect } from "react-redux";
import Login from "./login";
import Wrapper from "./wrapper";
import "./custom.css";
function BaseContainer(props) {
  if (Object.keys(props.session).length === 0) {
    return <Login />;
  } else {
    return <Wrapper />;
  }
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
export default connect(mapStateToProps)(BaseContainer);
