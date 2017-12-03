import React, { Component } from 'react';


export class Square extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMined: false
    }
  }

  render() {
    return(
      <button className="square">
        { this.props.hasMine.toString() }
      </button>
    );
  }
}

