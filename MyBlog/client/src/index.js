import React from "react";
import ReactDOM from "react-dom";
import { AppContextProvider } from "./app/appContext.jsx";
import { Router } from "./app/Router.jsx";
import "bootstrap/dist/css/bootstrap.css";
import "highlight.js/styles/github.css";
import "katex/dist/katex.min.css";
import "./index.css";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <AppContextProvider>
    <Router />
  </AppContextProvider>,

  rootElement
);
