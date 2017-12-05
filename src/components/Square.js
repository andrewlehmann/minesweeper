import React from "react";
import { Button } from "react-bootstrap";
import "./Square.css";

export function Square(props) {
  return (
    <Button
      bsStyle="default"
      bsSize="large"
      className="square"
      onClick={() => props.onClick()}
      onContextMenu={e => {
        e.preventDefault();
        props.onContextMenu();
      }}
      style={props.style}
    >
      {props.value}
    </Button>
  );
}
