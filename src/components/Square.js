import React from "react";
import { Button } from "react-bootstrap";

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
      style={{
        borderRadius: "1px",
        fontWeight: "bold",
        minWidth: "55px",
        minHeight: "55px",
        backgroundColor: props.bgColor,
        color: props.color
      }}
    >
      {props.value}
    </Button>
  );
}
