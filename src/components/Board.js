import React, { Component } from "react";
import { Square } from "./Square";

const SquareStatus = {
  EMPTY: 0,
  MINED: 1,
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

    this.state = {
      squares: this.initSquares(props.gridSize)
    };
  }

  calculateAdjacentMines(row, col) {
    let counter = 0;
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (
          i >= 0 &&
          j >= 0 &&
          i < this.props.gridSize &&
          j < this.props.gridSize &&
          this.containsMine(i, j)
        )
          counter++;
      }
    }
    return counter;
  }

  containsMine(row, col) {
    return (
      this.props.mineLocations.filter(
        square => square.x === row && square.y === col
      ).length > 0
    );
  }

  initSquares(size) {
    const squares = [];
    for (let i = 0; i < size; i++) {
      squares[i] = Array(size)
        .fill()
        .map(e => ({
          status: SquareStatus.EMPTY
        }));
    }
    return squares;
  }

  isAdjacent(row, col) {
    console.log("testing isAdj");
    if (!this.containsMine(row, col)) {
      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++)
          if (
            i >= 0 &&
            j >= 0 &&
            i < this.props.gridSize &&
            j < this.props.gridSize &&
            this.containsMine(i, j)
          )
            return true;
      }
    }
    return false;
  }

  flag(row, col) {
    const squares = this.state.squares.slice();
    if (squares[row][col].status === SquareStatus.EMPTY)
      squares[row][col].status = SquareStatus.FLAGGED;
    else if (squares[row][col].status === SquareStatus.FLAGGED)
      squares[row][col].status = SquareStatus.EMPTY;

    this.setState({
      squares: squares
    });
  }

  mine(row, col) {
    const squares = this.state.squares.slice();
    if (squares[row][col].status === SquareStatus.EMPTY) {
      squares[row][col].status = SquareStatus.MINED;
      this.setState({
        squares: squares
      }); // this might be in the wrong place

      if (!this.isAdjacent(row, col) && !this.containsMine(row, col)) {
        this.mineNeighbors(row, col);
      }
    }
  }

  mineNeighbors(row, col) {
    console.log("mine neighbors");
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (
          i >= 0 &&
          j >= 0 &&
          i < this.props.gridSize &&
          j < this.props.gridSize
        )
          this.mine(i, j);
      }
    }
  }

  renderSquare(row, col, length) {
    return (
      <Square
        key={length * row + col}
        hasMine={
          this.props.mineLocations.filter(
            square => square.x === row && square.y === col
          ).length > 0
        }
        onClick={() => this.mine(row, col)}
        onContextMenu={e => this.flag(row, col)}
        status={this.state.squares[row][col].status}
      />
    );
  }

  renderRow(length, rowNum) {
    let row = [];

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
    let board = [];

    for (let i = 0; i < gridSize; i++) {
      board.push(this.renderRow(gridSize, i));
    }

    return <div className="board"> {board} </div>;
  }

  render() {
    return this.renderBoard(this.props.gridSize);
  }
}
