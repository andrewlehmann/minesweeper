import React, { Component } from 'react';


export class Square extends Component {
  render() {
    return(
      <button className="square">
        { this.props.status }
      </button>
    );
  }
}

