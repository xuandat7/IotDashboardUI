import React, { useState, useEffect } from "react";
import Charts from "./Charts";
import "./Dashboard.css";

function Dashboard() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [brightness, setBrightness] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/SensorData", {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if the data is an array and has at least one element
      if (Array.isArray(data.rows) && data.rows.length > 0) {
        const latestData = data.rows[data.rows.length - 1];  // Get the latest data point

        // Log the latestData object to understand its structure
        console.log("Latest data:", latestData);

        // Check if latestData has the expected properties
        if (latestData && latestData.temperature !== undefined && latestData.humidity !== undefined && latestData.light !== undefined) {
          setTemperature(latestData.temperature);
          setHumidity(latestData.humidity);
          setBrightness(latestData.light);
        } else {
          console.error("Unexpected data format in latest entry:", latestData);
        }
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  useEffect(() => {
    const updateData = () => {
      fetchData();
    };

    // Fetch data initially and set an interval for updates
    updateData();
    const intervalId = setInterval(updateData, 5000);

    // Cleanup on component unmount
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
    if (lux >= 1000) {
      // Very bright, like direct sunlight
      return "linear-gradient(to right, #ff7300, #ff0000)";
    } else if (lux >= 700) {
      // Bright, indoor sunlight or overcast outdoor
      return "linear-gradient(to right, #f7971e, #ffd200)";
    } else if (lux >= 400) {
      // Moderate, typical indoor lighting
      return "linear-gradient(to right, #ffefba, #ffffff)";
    } else if (lux >= 200) {
      // Dim, typical dusk or indoor low lighting
      return "linear-gradient(to right, #a1c4fd, #c2e9fb)";
    } else if (lux >= 100) {
      // Very dim, early evening or cloudy conditions
      return "linear-gradient(to right, #89f7fe, #66a6ff)";
    } else if (lux >= 40) {
      // Twilight or very low artificial lighting
      return "linear-gradient(to right, #374785, #8a9eaf)";
    } else {
      // Extremely dark, like nighttime
      return "linear-gradient(to right, #2b5876, #4e4376)";
    }
  };
  

  return (
    <div className="dashboard">
      <div className="row">
        {/* Temperature Card */}
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