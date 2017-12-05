import React, { Component } from "react";
import { Board } from "./Board";
import { GameInfo } from "./GameInfo";
import { Button } from "react-bootstrap";

const centered = { display: "flex", justifyContent: "center" };

export class Game extends Component {
  render() {
    return (
      <div>
        <h1 style={centered}>Minesweeper</h1>
        <div className="game">
          <div className="game-board">
            <Board gridSize={10} ref={instance => (this.board = instance)} />
          </div>
          <GameInfo board={this.board} />
        </div>
      </div>
    );
  }
}
