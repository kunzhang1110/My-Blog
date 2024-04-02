import React from "react";
import ReactDOM from "react-dom";
import { AppContextProvider } from "./shared/appContext.jsx";
import { AppRouter } from "./shared/AppRouter.jsx";
import "bootstrap/dist/css/bootstrap.css";
import "highlight.js/styles/github.css";
import "katex/dist/katex.min.css";
import "./index.css";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <AppContextProvider>
    <AppRouter />
  </AppContextProvider>,

  rootElement
);
