import React from "react";
import ReactDOM from "react-dom/client";
import TideWatchApp from "./App.jsx";
import "./heroEnhancements.js";
import "./harbourEnhancements.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TideWatchApp />
  </React.StrictMode>
);
