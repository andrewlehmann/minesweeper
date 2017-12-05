import React, { Component } from "react";
import { Square } from "./Square";

const SquareStatus = {
  NOT_SWEPT: 0,
  SWEPT: 1,
  FLAGGED: 2
};

const GameStatus = {
  IN_PROGRESS: 0,
  WON: 1,
  LOST: 2
};

const AdjacentMinesTextColors = {
  ZERO: "#E0F2E9",
  ONE: "#0C6291",
  TWO: "#419141",
  THREE: "#9A031E",
  FOUR: "#002642",
  MORE: "#3D348B"
};

export class Board extends Component {
  constructor(props) {
    super(props);

    this.GRIDSIZE = props.gridSize;
    this.MINE_LOCATIONS = this.createMineLocations(this.GRIDSIZE);
    this.state = {
      squares: this.initSquares(this.GRIDSIZE)
    };
  }

  initSquares(size) {
    const squares = [];

    for (let i = 0; i < size; i++) {
      squares[i] = Array(size)
        .fill()
        .map(e => ({
          status: SquareStatus.NOT_SWEPT,
          value: "",
          color: "red",
          bgColor: "lightgrey"
        }));
    }
    return squares;
  }

  createMineLocations(numOfMines) {
    let mineLocations = [];
    let numPlaced = 0;

    while (numPlaced < numOfMines) {
      let nextMineLocation = {
        x: Math.floor(Math.random() * this.GRIDSIZE),
        y: Math.floor(Math.random() * this.GRIDSIZE)
      };

      if (!mineLocations.includes(nextMineLocation)) {
        mineLocations.push(nextMineLocation);
        numPlaced++;
      }
    }

    return mineLocations;
  }

  containsMine(row, col) {
    return (
      this.MINE_LOCATIONS
        .filter(square => square.x === row)
        .filter(square => square.y === col)
        .length > 0
    );
  }

  showMines() {
    const squares = this.state.squares.slice();
    this.MINE_LOCATIONS.forEach(e => squares[e.x][e.y].value = "*");
    this.setState({
      squares: squares
    });
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
    return this.state.squares[row][col].status === status;
  }

  checkForGameEnd() {
    let status = this.getCurrentGameStatus();
    if (status === GameStatus.LOST) {
      this.showMines();
    }
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
    const square = squares[row][col];

    if (this.checkStatus(row, col, SquareStatus.NOT_SWEPT)) {
      square.status = SquareStatus.FLAGGED;
      square.value = "|>";
    } else if (this.checkStatus(row, col, SquareStatus.FLAGGED)) {
      square.status = SquareStatus.NOT_SWEPT;
      square.value = " ";
    }

    squares[row][col] = square;

    this.setState({ squares: squares });
    this.checkForGameEnd();
  }

  sweepSquare(row, col) {
    const squares = this.state.squares.slice();
    const square = squares[row][col];

    if (square.status === SquareStatus.NOT_SWEPT) {
      square.status = SquareStatus.SWEPT;
      square.value = this.calculateAdjacentMines(row, col);
      square.color = this.getColor(row, col);
      square.bgColor = "#9999";
      squares[row][col] = square;
      this.setState({ squares: squares });
      if (!this.isAdjacent(row, col) && !this.containsMine(row, col)) {
        this.sweepNeighbors(row, col);
      }
      this.checkForGameEnd();
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

  getColor(row, col) {
    const squares = this.state.squares.slice();

    switch (squares[row][col].value) {
    case "*":
      return "crimson";
    case 1:
      return AdjacentMinesTextColors.ONE;
    case 2:
      return AdjacentMinesTextColors.TWO;
    case 3:
      return AdjacentMinesTextColors.THREE;
    case 4:
      return AdjacentMinesTextColors.FOUR;
    default:
      return AdjacentMinesTextColors.OTHER;
    }
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
    if (this.containsMine(row, col)) {
      return "*";
    } else if (counter === 0) {
      return " ";
    }
    return counter;
  }

  renderSquare(row, col, length) {
    const square = this.state.squares.slice()[row][col];

    return (
      <Square
        bgColor={square.bgColor}
        color={square.color}
        key={length * row + col}
        onClick={() => this.sweepSquare(row, col)}
        onContextMenu={e => this.flag(row, col)}
        status={square.status}
        style={square.style}
        value={square.value}
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
