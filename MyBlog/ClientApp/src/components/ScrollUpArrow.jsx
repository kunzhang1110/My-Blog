import React from "react";
import { BsArrowUpSquare } from "react-icons/bs";

export const ScrollUpArrow = () => {
  return (
    <div className="text-center mt-5 ScrollUpArrow">
      <a
        className="btn shadow-none"
        onClick={() => window.scrollTo(0, 0)}
        style={{ fontSize: "1.5rem", position: "relative" }}
      >
        <BsArrowUpSquare />
      </a>
    </div>
  );
};
