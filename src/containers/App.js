import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Game } from "../components/Game";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Game />
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("root"));

export default App;
