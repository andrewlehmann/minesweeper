import React, { Component } from "react";

import { Board } from "./Board";

export class Game extends Component {
  constructor() {
    super();
    this.createMineLocations = this.createMineLocations.bind(this);
  }

  createMineLocations(numOfMines) {
    let mineLocations = [];

    for (let i = 0; i < numOfMines; i++) {
      mineLocations.push({
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10)
      });
    }

    return mineLocations;
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board size={10} mineLocations={this.createMineLocations(10)} />
        </div>
        <div className="game-info" />
      </div>
    );
  }
}
