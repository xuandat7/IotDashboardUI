import React from "react";
import "./Dashboard.css";
import { useState } from 'react';

function Dashboard() {
  const [temperature, setTemperature] = useState(38);
  const [humidity, setHumidity] = useState(55);
  const [light, setLight] = useState(80);

  const getTemperatureGradient = (temp) => {
    if (temp > 30) {
      return 'linear-gradient(to right, #ff5f6d, #ffc371)'; // Hot (Red Gradient)
    } else if (temp < 18) {
      return 'linear-gradient(to right, #6dd5fa, #2980b9)'; // Cold (Blue Gradient)
    }
    return 'linear-gradient(to right, #89f7fe, #66a6ff)'; // Normal (Cool Blue Gradient)
  };

  const getHumidityGradient = (humid) => {
    if (humid > 70) {
      return 'linear-gradient(to right, #83a4d4, #b6fbff)'; // High Humidity (Light Blue Gradient)
    } else if (humid < 30) {
      return 'linear-gradient(to right, #ffecd2, #fcb69f)'; // Low Humidity (Warm Gradient)
    }
    return 'linear-gradient(to right, #89f7fe, #66a6ff)'; // Normal Humidity (Cool Blue Gradient)
  };

  const getLightGradient = (lux) => {
    if (lux > 100) {
      return 'linear-gradient(to right, #f7971e, #ffd200)'; // High Light (Yellow Gradient)
    } else if (lux < 40) {
      return 'linear-gradient(to right, #a1c4fd, #c2e9fb)'; // Low Light (Cool Light Gradient)
    }
    return 'linear-gradient(to right, #fdfbfb, #ebedee)'; // Normal Light (Neutral Gradient)
  };

  return (
    <section className="dashboard section">
      <h3 className="text-left">Dashboard</h3>
      <div className="row">
        {/* Temperature Card */}
        <div className="col-lg-4 col-md-6">
          <div
            className="card"
            style={{
              background: getTemperatureGradient(temperature),
            //   transition: 'background 0.5s ease-in-out', // Transition for background color
            //   willChange: 'background', // Optimize for animation,
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <i className="bi bi-thermometer icon"></i>
                <div className="text-right text-dark">
                  <h5>{temperature}°C</h5>
                  <p>Nhiệt độ</p>
                  <small className="text-muted">
                    {temperature > 30 ? "High" : temperature < 18 ? "Low" : "Normal"}
                  </small>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="form-range mt-3"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="col-lg-4 col-md-6">
          <div
            className="card"
            style={{
              background: getHumidityGradient(humidity),
              transition: 'background 0.5s ease-in-out', // Transition for background color
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <i className="bi bi-moisture icon"></i>
                <div className="text-right text-light">
                  <h5>{humidity}%</h5>
                  <p>Độ ẩm</p>
                  <small className="text-muted">
                    {humidity > 70 ? "High" : humidity < 30 ? "Low" : "Normal"}
                  </small>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    className="form-range mt-3"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Light Card */}
        <div className="col-lg-4 col-md-6">
          <div
            className="card"
            style={{
              background: getLightGradient(light),
              transition: 'background 0.5s ease', // Transition for background color
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <i className="bi bi-lightbulb-fill icon"></i>
                <div className="text-right">
                  <h5>{light} lux</h5>
                  <p>Ánh sáng</p>
                  <small className="text-muted">
                    {light > 100 ? "High" : light < 40 ? "Low" : "Normal"}
                  </small>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={light}
                    onChange={(e) => setLight(e.target.value)}
                    className="form-range mt-3"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
