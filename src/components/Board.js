import React, { Component } from "react";
import { Square } from "./Square";

export class Board extends Component {
  constructor(props) {
    super(props);
    this.renderSquare = this.renderSquare.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderBoard = this.renderBoard.bind(this);

    this.state = {
      squares: this.initSquares(props.size)
    };
  }

  initSquares(size) {
    const squares = [];
    for (let i = 0; i < size; i++) {
      squares[i] = Array(size).fill(false);
    }
    return squares;
  }

  mine(x, y) {
    const squares = this.state.squares.slice();
    squares[x][y] = true;
    this.setState({ squares: squares });
  }

  renderSquare(i, j, length) {
    return (
      <Square
        key={length * i + j}
        hasMine={this.props.mineLocations.filter(square => square.x === i && square.y === j).length > 0}
        onClick={() => this.mine(i, j)}
        isMined={this.state.squares[i][j]}
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

  renderBoard(size) {
    let board = [];

    for (let i = 0; i < size; i++) {
      board.push(this.renderRow(size, i));
    }

    return <div className="board">{board}</div>;
  }

  render() {
    return this.renderBoard(this.props.size);
  }
}
