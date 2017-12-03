import React, { Component } from "react";

import { Board } from "./Board";

export class Game extends Component {

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board gridSize={10} />
        </div>
        <div className="game-info" />
      </div>
    );
  }
}
