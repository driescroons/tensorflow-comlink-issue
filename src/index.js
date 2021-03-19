import React from "react";
import ReactDOM from "react-dom";

import Landmark from "./Landmark";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <Landmark />
  </React.StrictMode>,
  rootElement
);
