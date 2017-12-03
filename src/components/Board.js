import React, { Component } from "react";
import { Square } from "./Square";

const SquareStatus = {
  EMPTY: 0,
  MINED: 1,
  FLAGGED: 2
};

export class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      squares: this.initSquares(props.size)
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

  initSquares(size) {
    const squares = [];
    for (let i = 0; i < size; i++) {
      squares[i] = Array(size).fill().map(e => ({
        status: SquareStatus.EMPTY
      }));
    }
    return squares;
  }

  isAdjacent(row, col) {
    if (!this.state.squares[row][col].status === SquareStatus.MINED) {
      for(let i = row - 1; i <= row + 1; i++) {
        for(let j = col - 1; j <= col + 1; j++)
          if (this.state.squares[i][j].status === SquareStatus.MINED)
            return true;
      }
    }
    return false;
  }

  mine(row, col) {
    const squares = this.state.squares.slice();
    if(squares[row][col].status === SquareStatus.EMPTY) {
      squares[row][col].status = SquareStatus.MINED;
      this.setState({
        squares: squares
      });

      if(!this.isAdjacent(row, col) && !squares[row][col].status == SquareStatus.MINED) {
        //mineNeighbors(row, col);
      }
    }
  }

  flag(row, col) {
    const squares = this.state.squares.slice();
    if(squares[row][col].status === SquareStatus.EMPTY) {
      squares[row][col].status = SquareStatus.FLAGGED;
      this.setState({
        squares: squares
      });
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
    return this.renderBoard(this.props.size);
  }
}

