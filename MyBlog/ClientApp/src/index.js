import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./Auth";
import "highlight.js/styles/github.css";
import "bootstrap/dist/css/bootstrap.css";
import "katex/dist/katex.min.css";
import "./index.css";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const rootElement = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
  rootElement
);
