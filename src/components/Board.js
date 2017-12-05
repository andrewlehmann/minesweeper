import React, { Component } from "react";
import { Square } from "./Square";

const SquareStatus = {
  NOT_SWEPT: 0,
  SWEPT: 1,
  FLAGGED: 2
};

const GameStatus = {
  INPROGRESS: 0,
  WON: 1,
  LOST: 2
};

export class Board extends Component {
  constructor(props) {
    super(props);

    this.GRIDSIZE = props.gridSize;

    this.state = {
      squares: this.initSquares(this.GRIDSIZE),
      mineLocations: this.createMineLocations(this.GRIDSIZE)
    };
  }

  createMineLocations(numOfMines) {
    const mineLocations = [];
    //TODO: mines might be put in same location, might break win condition
    for (let i = 0; i < numOfMines; i++) {
      mineLocations.push({
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10)
      });
    }

    return mineLocations;
  }

  calculateAdjacentMines(row, col) {
    let counter = 0;
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (
          i >= 0 &&
          j >= 0 &&
          i < this.GRIDSIZE &&
          j < this.GRIDSIZE &&
          this.containsMine(i, j)
        )
          counter++;
      }
    }
    return counter;
  }

  containsMine(row, col) {
    return (
      this.state.mineLocations
        .filter(square => square.x === row)
        .filter(square => square.y === col).length > 0
    );
  }

  getCurrentGameStatus() {
    let flaggedMines = 0;
    let flaggedNonMines = 0;

    for (let i = 0; i < this.GRIDSIZE; i++) {
      for (let j = 0; j < this.GRIDSIZE; j++) {
        if (this.containsMine(i, j)) {
          if (this.checkStatus(i, j, SquareStatus.SWEPT)) {
            return GameStatus.LOST;
          } else if (this.checkStatus(i, j, SquareStatus.FLAGGED)) {
            flaggedMines++;
          }
        } else if (this.checkStatus(i, j, SquareStatus.FLAGGED)) {
          flaggedNonMines++;
        }
      }
    }

    if (flaggedMines === 10 && flaggedNonMines === 0) return GameStatus.WON;

    return GameStatus.IN_PROGRESS;
  }

  checkStatus(row, col, status) {
    return this.state.squares[row][col].stauts === status;
  }

  initSquares(size) {
    const squares = [];

    for (let i = 0; i < size; i++) {
      squares[i] = Array(size)
        .fill()
        .map(e => ({ status: SquareStatus.NOT_SWEPT, value: "*"}));
    }
    return squares;
  }

  isAdjacent(row, col) {
    if (!this.containsMine(row, col)) {
      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++)
          if (
            i >= 0 &&
            j >= 0 &&
            i < this.GRIDSIZE &&
            j < this.GRIDSIZE &&
            this.containsMine(i, j)
          )
            return true;
      }
    }
    return false;
  }

  flag(row, col) {
    const squares = this.state.squares.slice();

    if (this.checkStatus(row, col, SquareStatus.NOT_SWEPT)) {
      squares[row][col].status = SquareStatus.FLAGGED;
    } else if (this.checkStatus(row, col, SquareStatus.FLAGGED)) {
      squares[row][col].status = SquareStatus.NOT_SWEPT;
    }

    this.setState({ squares: squares });
  }

  sweepSquare(row, col) {
    const squares = this.state.squares.slice();

    if (squares[row][col].status === SquareStatus.NOT_SWEPT) {
      squares[row][col].status = SquareStatus.SWEPT;
      squares[row][col].value = this.calculateAdjacentMines(row, col);

      this.setState({ squares: squares });

      if (!this.isAdjacent(row, col) && !this.containsMine(row, col)) {
        this.sweepNeighbors(row, col);
      }
    }
  }

  sweepNeighbors(row, col) {
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && j >= 0 && i < this.GRIDSIZE && j < this.GRIDSIZE)
          this.sweepSquare(i, j);
      }
    }
  }

  renderSquare(row, col, length) {
    return (
      <Square
        key={length * row + col}
        onClick={() => this.sweepSquare(row, col)}
        onContextMenu={e => this.flag(row, col)}
        status={this.state.squares[row][col].status}
        value={this.state.squares[row][col].value}
      />
    );
  }

  renderRow(length, rowNum) {
    const row = [];

    for (let i = 0; i < length; i++) {
      row.push(this.renderSquare(rowNum, i, length));
    }

    return (
      <div className="board-row" key={rowNum}>
        {row}
      </div>
    );
  }

  renderBoard(gridSize) {
    const board = [];

    for (let i = 0; i < gridSize; i++) {
      board.push(this.renderRow(gridSize, i));
    }

    return <div className="board"> {board} </div>;
  }

  render() {
    return this.renderBoard(this.GRIDSIZE);
  }
}
