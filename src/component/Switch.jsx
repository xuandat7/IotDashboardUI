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

  // Fetch the initial states from the API
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

    // Fetch device status every 2 seconds to update the UI
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

    setIsFanLoading(true); // Show loading spinner
    try {
      await axios.post(apiFanUrl);
      console.log(`Request to turn fan ${newFanState ? "on" : "off"} sent`);
      // Không cập nhật FanSetChecked ngay lập tức, chờ phản hồi từ API qua useEffect
    } catch (error) {
      console.error("Error toggling fan:", error);
    } finally {
      setIsFanLoading(false); // Hide loading spinner after response
    }
  };

  // Toggle light state
  const toggleLight = async () => {
    if (!LightConnected || !isConnected) return;

    const newLightState = !LightChecked;
    const apiLedUrl = `http://localhost:3001/devices/led/${
      newLightState ? "on" : "off"
    }`;

    setIsLightLoading(true); // Show loading spinner
    try {
      await axios.post(apiLedUrl);
      console.log(`Request to turn light ${newLightState ? "on" : "off"} sent`);
      // Không cập nhật LightSetChecked ngay lập tức, chờ phản hồi từ API qua useEffect
    } catch (error) {
      console.error("Error toggling light:", error);
    } finally {
      setIsLightLoading(false); // Hide loading spinner after response
    }
  };

  // Toggle temperature state
  const toggleTemperature = async () => {
    if (!TempConnected || !isConnected) return;

    const newTempState = !TempChecked;
    const apiTempUrl = `http://localhost:3001/devices/tem/${
      newTempState ? "on" : "off"
    }`;

    setIsTempLoading(true); // Show loading spinner
    try {
      await axios.post(apiTempUrl);
      console.log(
        `Request to turn temperature ${newTempState ? "on" : "off"} sent`
      );
      // Không cập nhật TempSetChecked ngay lập tức, chờ phản hồi từ API qua useEffect
    } catch (error) {
      console.error("Error toggling temperature:", error);
    } finally {
      setIsTempLoading(false); // Hide loading spinner after response
    }
  };

  return (
    <section className="switch section">
      <div className="row">
        <div className="card card-switch mt-3" style={{ height: "400px" }}>
          {/* Temperature Switch */}
          {/* <h6>Điều khiển nhiệt độ</h6> */}
          <div className="temp-switch d-flex align-items-center">
            <i
              className={`bi bi-thermometer ${
                TempChecked ? "icon-on animate-icon" : ""
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
              <button className="btn btn-primary" type="button" disabled>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </button>
            )}
          </div>

          {/* Fan Switch */}
          {/* <h6>Điều khiển quạt</h6> */}
          <div className="humidity-switch d-flex align-items-center">
            <i
              className={`bi bi-fan icon ${
                FanChecked ? "icon-on icon-fan-on" : ""
              }`}
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
              <button className="btn btn-primary" type="button" disabled>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </button>
            )}
          </div>

          {/* Light Switch */}
          {/* <h6>Điều khiển đèn</h6> */}
          <div className="light-switch d-flex align-items-center">
            <i
              className={`bi bi-lightbulb icon ${
                LightChecked ? "icon-on animate-icon" : ""
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
              <button className="btn btn-primary" type="button" disabled>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </button>
            )}
          </div>

          {/* Optional error message */}
          {(!isConnected ||
            !FanConnected ||
            !LightConnected ||
            !TempConnected) && (
            <p className="error-message">
              One or more devices are not connected. Please check your
              connection.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Switch;
