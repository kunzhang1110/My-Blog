import React from "react";
import { BsArrowUpSquare } from "react-icons/bs";

export const ScrollUpArrow = () => {
  return (
    <div
      className="text-center"
      onClick={() => window.scrollTo(0, 0)}
      color="transparent"
      style={{
        fontSize: "1.5rem",
        position: "fixed",
        bottom: "3vh",
        right: "5vw",
        cursor: "pointer",
      }}
    >
      <BsArrowUpSquare />
    </div>
  );
};
