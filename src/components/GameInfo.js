import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Board } from "./Board";

export class GameInfo extends Component {
  render() {
    console.log(this.props);
    return (
      <div
        className="game-info"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Button bsStyle="danger" onClick={() => this.props.board.reset()}>
          Reset
        </Button>
      </div>
    );
  }
}
