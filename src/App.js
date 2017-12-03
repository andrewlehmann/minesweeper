import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Game } from './Game';
import './App.css';

class App extends Component {
  render() {
    return (
       <Game />
    );
  }
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

export default App;
