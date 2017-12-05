import React, { Component } from "react";
import { Button } from "react-bootstrap";

export class GameInfo extends Component {
  render() {
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
