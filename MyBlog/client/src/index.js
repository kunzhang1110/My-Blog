import React from "react";
import ReactDOM from "react-dom";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./app/auth.jsx";
import "highlight.js/styles/github.css";
import "bootstrap/dist/css/bootstrap.css";
import "katex/dist/katex.min.css";
import "./index.css";
import { router } from "./app/router.jsx";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
  rootElement
);
