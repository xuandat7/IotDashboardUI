import React, { useState, useEffect } from "react";
import "./Switch.css";
import Toggle from "react-bootstrap-toggle";
import "react-bootstrap-toggle/dist/bootstrap2-toggle.css";
import axios from "axios";

function Switch() {
  const [TempChecked, TempSetChecked] = useState(false); // Temperature state
  const [FanChecked, FanSetChecked] = useState(false); // Fan state
  const [LightChecked, LightSetChecked] = useState(false); // Light state
  const [FanConnected, setFanConnected] = useState(true); // Fan connection status
  const [LightConnected, setLightConnected] = useState(true); // Light connection status
  const [TempConnected, setTempConnected] = useState(true); // Temperature connection status
  const [isConnected, setIsConnected] = useState(true); // Overall connection status

  // Fetch the initial states from the API
  useEffect(() => {
    const fetchDeviceStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3001/deviceStatus/device-status");
        const { led, fan, tem } = response.data;

        // Set states based on API response
        LightSetChecked(led.state === "on");
        FanSetChecked(fan.state === "on");
        TempSetChecked(tem.state === "on");

        setLightConnected(led.connected);
        setFanConnected(fan.connected);
        setTempConnected(tem.connected);

      } catch (error) {
        console.error("Error fetching device status:", error);
        setIsConnected(false);
      }
    };

    const fetchConnection = async () => {
      try {
        const response = await axios.get("http://localhost:3001/esp8266/status");
        if(response.data.status === "connected") {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        console.error("Error fetching connection status:", error);
        setIsConnected(false);
      }
    };

    fetchConnection();
    fetchDeviceStatus();
  }, []);

  // Toggle fan state
  const toggleFan = async () => {
    if (!FanConnected || !isConnected) return;

    const newFanState = !FanChecked;
    FanSetChecked(newFanState);
    localStorage.setItem("FanChecked", JSON.stringify(newFanState));

    const apiFanUrl = `http://localhost:3001/devices/fan/${newFanState ? "on" : "off"}`;
    try {
      await axios.post(apiFanUrl);
      console.log(`Fan turned ${newFanState ? "on" : "off"}`);
    } catch (error) {
      console.error("Error toggling fan:", error);
    }
  };

  // Toggle light state
  const toggleLight = async () => {
    if (!LightConnected || !isConnected) return;

    const newLightState = !LightChecked;
    LightSetChecked(newLightState);
    localStorage.setItem("LightChecked", JSON.stringify(newLightState));

    const apiLedUrl = `http://localhost:3001/devices/led/${newLightState ? "on" : "off"}`;
    try {
      await axios.post(apiLedUrl);
      console.log(`Light turned ${newLightState ? "on" : "off"}`);
    } catch (error) {
      console.error("Error toggling light:", error);
    }
  };

  // Toggle temperature state
  const toggleTemperature = async () => {
    if (!TempConnected || !isConnected) return;

    const newTempState = !TempChecked;
    TempSetChecked(newTempState);
    localStorage.setItem("TempChecked", JSON.stringify(newTempState));

    const apiTempUrl = `http://localhost:3001/devices/tem/${newTempState ? "on" : "off"}`;
    try {
      await axios.post(apiTempUrl);
      console.log(`Temperature turned ${newTempState ? "on" : "off"}`);
    } catch (error) {
      console.error("Error toggling temperature:", error);
    }
  };

  return (
    <section className="switch section">
      <div className="row">
        <div className="card card-switch mt-3" style={{ height: "520px" }}>
          {/* Temperature Switch */}
          <h6>Điều khiển nhiệt độ</h6>
          <div className="temp-switch d-flex align-items-center">
            <i
              className={`bi bi-thermometer ${TempChecked ? "icon-on animate-icon" : ""}`}
              style={{ fontSize: "30px" }}
            ></i>
            <Toggle
              className="toggle mx-2 toggle-handle"
              onClick={toggleTemperature}
              on={<h5>On</h5>}
              off={<h5>Off</h5>}
              size="lg"
              active={TempChecked}
              onstyle="success"
              offstyle="secondary"
              disabled={!TempConnected || !isConnected} // Disable toggle if not connected
            />
          </div>

          {/* Fan Switch */}
          <h6>Điều khiển quạt</h6>
          <div className="humidity-switch d-flex align-items-center">
            <i
              className={`bi bi-fan icon ${FanChecked ? "icon-on icon-fan-on" : ""}`}
              style={{ fontSize: "30px" }}
            ></i>
            <Toggle
              className="toggle mx-2"
              onClick={toggleFan}
              on={<h5>On</h5>}
              off={<h5>Off</h5>}
              size="lg"
              active={FanChecked}
              onstyle="success"
              offstyle="secondary"
              disabled={!FanConnected || !isConnected} // Disable toggle if not connected
            />
          </div>

          {/* Light Switch */}
          <h6>Điều khiển đèn</h6>
          <div className="light-switch d-flex align-items-center">
            <i
              className={`bi bi-lightbulb icon ${LightChecked ? "icon-on animate-icon" : ""}`}
              style={{ fontSize: "30px" }}
            ></i>
            <Toggle
              className="toggle mx-2"
              onClick={toggleLight}
              on={<h5>On</h5>}
              off={<h5>Off</h5>}
              size="lg"
              active={LightChecked}
              onstyle="success"
              offstyle="secondary"
              disabled={!LightConnected || !isConnected} // Disable toggle if not connected
            />
          </div>

          {/* Optional error message */}
          {(!isConnected || !FanConnected || !LightConnected || !TempConnected) && (
            <p className="error-message">One or more devices are not connected. Please check your connection.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Switch;
