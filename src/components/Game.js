import React, { Component } from "react";
import { Board } from "./Board";
import { Button } from "react-bootstrap";

const centered = { display: "flex", justifyContent: "center" };

export class Game extends Component {
  render() {
    return (
      <div>
        <h1 style={centered}>Minesweeper</h1>
        <div className="game">
          <div className="game-board">
            <Board gridSize={10} />
          </div>
          <div className="game-info" style={centered}>
            <Button bsStyle="danger">Reset</Button>
          </div>
        </div>
      </div>
    );
  }
}
