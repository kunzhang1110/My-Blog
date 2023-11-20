import React from "react";

export default function ErrorPage({ message }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "90vh" }}
    >
      <h1>{message}</h1>
    </div>
  );
}
