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

  const [isFanLoading, setIsFanLoading] = useState(false); // Fan loading state
  const [isLightLoading, setIsLightLoading] = useState(false); // Light loading state
  const [isTempLoading, setIsTempLoading] = useState(false); // Temperature loading state

  useEffect(() => {
    const fetchDeviceStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/deviceStatus/device-status"
        );
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

    const intervalId = setInterval(fetchDeviceStatus, 2000);
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  // Toggle fan state
  const toggleFan = async () => {
    if (!FanConnected || !isConnected) return;

    const newFanState = !FanChecked;
    const apiFanUrl = `http://localhost:3001/devices/fan/${
      newFanState ? "on" : "off"
    }`;

    setIsFanLoading(true);
    try {
      await axios.post(apiFanUrl);
      console.log(`Fan ${newFanState ? "on" : "off"} request sent`);
    } catch (error) {
      console.error("Error toggling fan:", error);
    } finally {
      setIsFanLoading(false);
    }
  };

  // Toggle light state
  const toggleLight = async () => {
    if (!LightConnected || !isConnected) return;

    const newLightState = !LightChecked;
    const apiLedUrl = `http://localhost:3001/devices/led/${
      newLightState ? "on" : "off"
    }`;

    setIsLightLoading(true);
    try {
      await axios.post(apiLedUrl);
      console.log(`Light ${newLightState ? "on" : "off"} request sent`);
    } catch (error) {
      console.error("Error toggling light:", error);
    } finally {
      setIsLightLoading(false);
    }
  };

  // Toggle temperature state
  const toggleTemperature = async () => {
    if (!TempConnected || !isConnected) return;

    const newTempState = !TempChecked;
    const apiTempUrl = `http://localhost:3001/devices/tem/${
      newTempState ? "on" : "off"
    }`;

    setIsTempLoading(true);
    try {
      await axios.post(apiTempUrl);
      console.log(`Temperature ${newTempState ? "on" : "off"} request sent`);
    } catch (error) {
      console.error("Error toggling temperature:", error);
    } finally {
      setIsTempLoading(false);
    }
  };

  return (
    <section className="switch-section">
      <div className="row justify-content-center">
        <div className="card card-switch shadow p-3 mt-4 bg-white rounded">
          <h5 className="text-center mb-4">Device Control Panel</h5>

          <div className="switch-container">
            {/* Temperature Switch */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <i
                className={`bi bi-thermometer ${
                  TempChecked ? "icon-temperature-active" : ""
                }`}
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
                disabled={!TempConnected || !isConnected || isTempLoading}
              />
              {isTempLoading && (
                <span className="spinner-border spinner-border-sm text-primary"></span>
              )}
            </div>

            {/* Light Switch */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <i
                className={`bi bi-lightbulb ${
                  LightChecked ? "icon-light-active" : ""
                }`}
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
                disabled={!LightConnected || !isConnected || isLightLoading}
              />
              {isLightLoading && (
                <span className="spinner-border spinner-border-sm text-primary"></span>
              )}
            </div>

            {/* Fan Switch */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <i
                className={`bi bi-fan ${FanChecked ? "icon-fan-active" : ""}`}
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
                disabled={!FanConnected || !isConnected || isFanLoading}
              />
              {isFanLoading && (
                <span className="spinner-border spinner-border-sm text-primary"></span>
              )}
            </div>
          </div>

          {/* Optional error message */}
          {(!isConnected ||
            !FanConnected ||
            !LightConnected ||
            !TempConnected) && (
            <p className="error-message text-danger text-center">
              Please check your connection.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Switch;
