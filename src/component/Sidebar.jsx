
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {

    return (
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-item" >
                    <Link to ="/" className="nav-link active">
                        <i className="bi bi-house-door-fill"></i>
                        <span>Home</span>
                    </Link>
                </li>
                <li className="nav-item" >
                    <Link to ="/dataSensor" className="nav-link active">
                        <i className="bi bi-clipboard-data-fill"></i>
                        <span>Data Sensor</span>
                    </Link>
                </li>
                <li className="nav-item" >
                    <Link to ="/ActionHistory" className="nav-link active">
                        <i className="bi bi-clipboard-data-fill"></i>
                        <span>Action History</span>
                    </Link>
                </li>

                <li className="nav-item" >
                    <Link to="/users" className="nav-link">
                        <i className="bi bi-person-fill"></i>
                        <span>User</span>
                    </Link>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
