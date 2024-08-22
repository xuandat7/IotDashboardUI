import React from "react";
import "./Switch.css";
import Toggle from "react-bootstrap-toggle";
import "react-bootstrap-toggle/dist/bootstrap2-toggle.css";

function Switch() {
  const [TempChecked, TempSetChecked] = React.useState(false);
  const [FanChecked, FanSetChecked] = React.useState(false);
  const [LightChecked, LightSetChecked] = React.useState(false);
  return (
    <section className="switch section">
      <div className="row">
        <div className="card card-switch mt-5" style={{height: '400px'}}>

            
              {/* Temperature Switch */}
              <div className="temp-switch d-flex align-items-center">
                <i
                  className="bi bi-thermometer"
                  style={{ color: "var(--primary)", fontSize: "30px" }}
                ></i>
                <Toggle
                  className="toggle mx-4 toggle-handle"
                  onClick={() => TempSetChecked(!TempChecked)}
                  on={<h5>On</h5>}
                  off={<h5>Off</h5>}
                  size="lg"
                  active={TempChecked}
                  onstyle="success"
                  offstyle="secondary"
                />
              </div>

              {/* Humidity Switch */}
              <div className="humidity-switch d-flex align-items-center">
                <i
                  className="bi bi-fan icon"
                  style={{ color: "var(--primary)", fontSize: "30px" }}
                ></i>
                <Toggle
                  className="toggle mx-4"
                  onClick={() => FanSetChecked(!FanChecked)}
                  on={<h5>On</h5>}
                  off={<h5>Off</h5>}
                  size="lg"
                  active={FanChecked}
                  onstyle="success"
                  offstyle="secondary"
                />
              </div>

              {/* Light Switch */}
              <div className="light-switch d-flex align-items-center">
                <i
                  className="bi bi-lightbulb icon"
                  style={{ color: "var(--primary)", fontSize: "30px" }}
                ></i>
                <Toggle
                  className="toggle mx-4"
                  onClick={() => LightSetChecked(!LightChecked)}
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
