import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import MainApp from "./MainApp";
import Store from "./Store";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={Store}>
    <MainApp />
  </Provider>
);
