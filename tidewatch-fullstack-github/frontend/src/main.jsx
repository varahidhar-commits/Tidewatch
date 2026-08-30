import React from "react";
import ReactDOM from "react-dom/client";
import TideWatchApp from "./App.jsx";
import "./heroLayoutFix.js";
import "./wholePageI18n.js";
import "./industryDemoGuide.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TideWatchApp />
  </React.StrictMode>
);
