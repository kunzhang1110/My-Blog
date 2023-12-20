import React from "react";
import gif from "../assets/logos/loading-waiting.gif";

export const Spinner = ({ size, containerHeight, className, fullPage }) => {
  if (fullPage) {
    size = "5rem";
    containerHeight = "120vh";
    className = "justify-content-center";
  }

  const containerStyle = {
    height: containerHeight,
  };

  const imgStyle = {
    width: size,
    height: size,
  };

  return (
    <div
      className={className + " d-flex align-items-center"}
      style={containerStyle}
    >
      <img src={gif} alt="loading..." style={imgStyle} />
    </div>
  );
};

Spinner.defaultProps = {
  size: "4rem",
  className: "",
  containerHeight: "120%",
};
