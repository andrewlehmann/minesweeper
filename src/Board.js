import React, { Component } from 'react';
import { Square } from './Square';

export class Board extends Component {

    constructor(props) {
        super(props);
        this.renderSquare = this.renderSquare.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderBoard = this.renderBoard.bind(this);
        this.createMineLocations = this.createMineLocations.bind(this);
        
        this.mineLocations = this.createMineLocations(props.size);
    }

    createMineLocations(numOfMines) {
        let mineLocations = [];

        for(let i = 0; i < numOfMines; i++) {
            mineLocations.push(Math.floor(Math.random() * 100));
        }
        
        return mineLocations;
        
    }

    renderSquare(status) {
        if (this.mineLocations.includes(status)) {
            return <Square status={status} hasMine={true} />;
        }
        return <Square status={status} hasMine={false} />;
    }

    renderRow(length, rowNum) {
        let row = [];

        for(let i = 0; i < length; i++) {
            row.push(this.renderSquare(rowNum * length + i));
        }

        return(
            <div className="board-row">
                {row}
            </div>
        );
    }

    renderBoard(size) {
        let board = [];

        for(let i = 0; i < size; i++) {
            board.push(this.renderRow(size, i));
        }

        return(
            <div className="board">
                {board}
            </div>
        );
    }

    
    render() {
        return(this.renderBoard(this.props.size));
    }
}