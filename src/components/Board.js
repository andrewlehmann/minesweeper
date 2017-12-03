import React, { Component } from "react";
import { Square } from "./Square";

export class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      squares: this.initSquares(props.size, false)
    };
  }

  calculateAdjacentMines(row, col) {
    let counter = 0;
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (
          i >= 0 &&
          j >= 0 &&
          i < this.props.size &&
          j < this.props.size &&
          this.state.squares[i][j]
        )
          counter++;
      }
    }
    return counter;
  }

  initSquares(size, contents) {
    const squares = [];
    for (let i = 0; i < size; i++) {
      squares[i] = Array(size).fill(contents);
    }
    return squares;
  }

  mine(x, y) {
    const squares = this.state.squares.slice();
    squares[x][y] = true;
    this.setState({
      squares: squares
    });
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
        isMined={this.state.squares[row][col]}
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
    return this.renderBoard(this.props.size);
  }
}
