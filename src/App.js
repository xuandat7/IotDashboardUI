import "./App.css";
import Header from "./component/Header";

// import icons have been installed
import "bootstrap-icons/font/bootstrap-icons.css";
import "remixicon/fonts/remixicon.css";
import { BrowserRouter, Routes, Route, Router, Link } from "react-router-dom";

// import bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Sidebar from "./component/Sidebar";
import Main from "./component/Main";
import Dashboard from "./component/Dashboard";

import Users from "./component/Users";
import DataSensor from "./component/DataSensor";
import ActionHistory from "./component/ActionHistory";
import Footer from "./component/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/dataSensor" element={<DataSensor />} />
          <Route path="/ActionHistory" element={<ActionHistory/>} />
          <Route path="/users" element={<Users />} />
        </Routes>
        <Footer/>

      </BrowserRouter>

    </>
  );
}

export default App;
