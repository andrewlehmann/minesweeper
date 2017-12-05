import React, { Component } from "react";
import { Square } from "./Square";
import { ButtonGroup } from "react-bootstrap";

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

const AdjacentMinesTextColors = {
  ZERO: "#9fabb7",
  ONE: "#1e90ff",
  TWO: "##228b22",
  THREE: "#c71585", 
  FOUR: "#800000",
  MORE: "#7b68ee"
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
    }
    else if(counter === 0) {
      return " ";
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
    return this.state.squares[row][col].status === status;
  }

  initSquares(size) {
    const squares = [];

    for (let i = 0; i < size; i++) {
      squares[i] = Array(size)
        .fill()
        .map(e => ({ 
          status: SquareStatus.NOT_SWEPT, 
          value: "-",
          color: "white",
          style: {
            borderRadius: "1px",
            minWidth: "50px",
            minHeight: "50px",
            backgroundColor: "slategrey",
            color: "white"
          }
        }));
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

  disableSquare(row, col) {
    
  }

  flag(row, col) {
    const squares = this.state.squares.slice();

    if (this.checkStatus(row, col, SquareStatus.NOT_SWEPT)) {
      squares[row][col].status = SquareStatus.FLAGGED;
      squares[row][col].value = "|>";
    } else if (this.checkStatus(row, col, SquareStatus.FLAGGED)) {
      squares[row][col].status = SquareStatus.NOT_SWEPT;
      squares[row][col].value = "-";
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

  updateColor(row, col) {
    const squares = this.state.squares.slice();

    switch(squares[row][col].value) {
    case "*":
      squares[row][col].style.color = "crimson"; break;
    case "1":
      squares[row][col].style.color = AdjacentMinesTextColors.ONE; break;
    case "2":
      squares[row][col].style.color = AdjacentMinesTextColors.TWO; break;
    case "3":
      squares[row][col].style.color = AdjacentMinesTextColors.THREE; break;
    case "4":
      squares[row][col].style.color = AdjacentMinesTextColors.FOUR; break;
    default: 
      squares[row][col].style.color = AdjacentMinesTextColors.OTHER;
    }

    this.setState({
      squares: squares
    });
  }

  renderSquare(row, col, length) {
    const square = this.state.squares.slice()[row][col];

    return (
      <Square
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
      <ButtonGroup vertical className="board-row" key={rowNum}>
        {row}
      </ButtonGroup>
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
