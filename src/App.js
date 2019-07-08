import React from "react";
import "./App.css";
import BaseContainer from "./components/baseContainer";

/**
 * Redux Imports
 * Redux Store to maintain state tree
 * StoreCreator and Provider from redux kits
 * Creating store with the reducer
 */
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./redux/reducer";
const store = createStore(reducer);

/**
 * App Base Container
 */
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <BaseContainer />
        </header>
      </div>
    </Provider>
  );
}

export default App;
