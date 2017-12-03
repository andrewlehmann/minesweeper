import React from "react";

export function Square(props) {
  return (
    <button
      className="square"
      onClick={() => props.onClick()}
      onContextMenu={e => {
        e.preventDefault();
        props.onContextMenu();
      }}
    >
      {props.status.toString()}
    </button>
  );
}
