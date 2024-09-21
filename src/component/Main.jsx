import React from "react";
import "./Main.css";
import Dashboard from "./Dashboard";
import Charts from "./Charts";
import Switch from "./Switch";
import Users from "./Users";
import Footer from "./Footer";
function Main() {


  
  return (
    <main id="main" className="main">
      <Dashboard />
      <div className="row">
        <div className="col-9">
          <Charts />
        </div>
        <div className="col-3">
          <Switch />
        </div>
      </div>
      
    </main>
  );
}

export default Main;