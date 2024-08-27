import React, { useState, useEffect } from "react";
import Charts from "./Charts";
import "./Dashboard.css";

function Dashboard() {
  const [temperature, setTemperature] = useState();
  const [humidity, setHumidity] = useState();
  const [brightness, setBrightness] = useState();

  const fetchData = () => {
    // Simulate fetching new data
    const newTemperature = Math.floor(Math.random() * 10) + 20;
    const newHumidity = Math.floor(Math.random() * 20) + 30;
    const newBrightness = Math.floor(Math.random() * 100) + 100;

    return {
      temperature: newTemperature,
      humidity: newHumidity,
      brightness: newBrightness,
    };
  };

  useEffect(() => {
    const updateData = () => {
      const newData = fetchData();
      setTemperature(newData.temperature);
      setHumidity(newData.humidity);
      setBrightness(newData.brightness);
    };

    const intervalId = setInterval(updateData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const getTemperatureGradient = (temp) => {
    if (temp < 14) return "linear-gradient(to right, #00f, #0ff)";
    if (temp > 31) return "linear-gradient(to right, #f00, #ff0)";
    return "linear-gradient(to right, #0f0, #ff0)";
  };

  const getHumidityGradient = (humid) => {
    if (humid > 70) return "linear-gradient(to right, #3a7bd5, #3a6073)";
    if (humid < 30) return "linear-gradient(to right, #f6d365, #fda085)";
    return "linear-gradient(to right, #89f7fe, #66a6ff)";
  };

  const getLightGradient = (lux) => {
    if (lux > 100) return "linear-gradient(to right, #f7971e, #ffd200)";
    if (lux < 40) return "linear-gradient(to right, #a1c4fd, #c2e9fb)";
    return "linear-gradient(to right, #fdfbfb, #ebedee)";
  };

  return (
    <div className="dashboard">
      <div className="row">
        <div className="col-lg-4">
          <div
            className="card"
            style={{
              background: getTemperatureGradient(temperature),
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <i className="bi bi-thermometer icon"></i>
                {temperature < 14 && <i className="bi bi-snow2"></i>}
                {temperature > 31 && <i className="bi bi-brightness-high-fill"></i>}
                <div className="text-right text-dark">
                  <h5>{temperature}°C</h5>
                  <p>Nhiệt độ</p>
                  <small className="text-muted">
                    {temperature > 30
                      ? "High"
                      : temperature < 18
                      ? "Low"
                      : "Normal"}
                  </small>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="col-md-4">
          <div
            className="card"
            style={{
              background: getHumidityGradient(humidity),
              transition: "background 0.5s ease-in-out", // Transition for background color
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
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brightness Card */}
        <div className="col-md-4">
          <div
            className="card"
            style={{
              background: getLightGradient(brightness),
              transition: "background 0.5s ease", // Transition for background color
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <i className="bi bi-brightness-high icon"></i>
                <div className="text-right">
                  <h5>{brightness} lux</h5>
                  <p>Độ sáng</p>
                  <small className="text-muted">
                    {brightness > 100 ? "High" : brightness < 40 ? "Low" : "Normal"}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;