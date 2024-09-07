import React, { useState } from "react";
import "./Switch.css";
import Toggle from "react-bootstrap-toggle";
import "react-bootstrap-toggle/dist/bootstrap2-toggle.css";
import axios from "axios";

function Switch() {
  const [TempChecked, TempSetChecked] = useState(false);
  const [FanChecked, FanSetChecked] = useState(false);
  const [LightChecked, LightSetChecked] = useState(false);

  // Hàm bật tắt quạt
  const toggleFan = async () => {
    const newFanState = !FanChecked;
    FanSetChecked(newFanState);

    // Gọi API tương ứng để bật/tắt quạt
    const apiFanUrl = `http://localhost:3001/devices/fan/${newFanState ? "on" : "off"}`;
    
    try {
      await axios.post(apiFanUrl);  // Gửi lệnh đến server
      console.log(`Fan turned ${newFanState ? "on" : "off"}`);
    } catch (error) {
      console.error("Error toggling fan:", error);
    }
  };

  // Hàm bật tắt đèn
  const toggleLight = async () => {
    const newLightState = !LightChecked;
    LightSetChecked(newLightState);

    // Gọi API tương ứng để bật/tắt đèn
    const apiLedUrl = `http://localhost:3001/devices/led/${newLightState ? "on" : "off"}`;
    
    try {
      await axios.post(apiLedUrl);  // Gửi lệnh đến server
      console.log(`Light turned ${newLightState ? "on" : "off"}`);
    } catch (error) {
      console.error("Error toggling light:", error);
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
              onClick={() => TempSetChecked(!TempChecked)}
              on={<h5>On</h5>}
              off={<h5>Off</h5>}
              size="lg"
              active={TempChecked}
              onstyle="success"
              offstyle="secondary"
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
              onClick={toggleFan}  // Gọi hàm toggleFan khi nhấn nút
              on={<h5>On</h5>}
              off={<h5>Off</h5>}
              size="lg"
              active={FanChecked}
              onstyle="success"
              offstyle="secondary"
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
              onClick={toggleLight}  // Gọi hàm toggleLight khi nhấn nút
              on={<h5>On</h5>}
              off={<h5>Off</h5>}
              size="lg"
              active={LightChecked}
              onstyle="success"
              offstyle="secondary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Switch;
