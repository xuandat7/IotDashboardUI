import React from "react";
import "./Main.css";
import Dashboard from "./Dashboard";
import Charts from "./Charts";
import Switch from "./Switch";
import Users from "./Users";
function Main() {


  
  return (
    <main id="main" className="main">
      <Dashboard />
      <div className="row">
        <div className="col-10">
          <Charts />
        </div>
        <div className="col-2">
          <Switch />
        </div>
      </div>
    </main>
  );
}

export default Main;