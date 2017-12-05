import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Game } from "../components/Game";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Game />
    );
  }
}
ReactDOM.render(
  <App />,
  document.getElementById("root")
);

export default App;
