import React, { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [brightness, setBrightness] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/SensorData/sort?sortField=createdAt&sortOrder=desc&page=1&limit=1",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      // Đảm bảo 'data.rows' có ít nhất 1 phần tử
      if (data.rows && data.rows.length > 0) {
        const latestData = data.rows[0]; // Lấy phần tử đầu tiên (mới nhất)

        // Cập nhật giá trị temperature, humidity, brightness
        setTemperature(latestData.temperature);
        setHumidity(latestData.humidity);
        setBrightness(latestData.light);
      } else {
        console.error("No data available:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const updateData = () => {
      fetchData();
    };

    // Gọi fetch data ngay khi component mount
    updateData();

    // Thiết lập interval để gọi API mỗi 5 giây
    const intervalId = setInterval(updateData, 5000);

    // Cleanup interval khi component bị unmount
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
      return "linear-gradient(to right, #ffffe0, #fffacd)"; // Very bright light: yellow-white gradient
    } else if (lux >= 700) {
      return "linear-gradient(to right, #fffacd, #ffebcd)"; // Bright light: light yellow to light beige
    } else if (lux >= 400) {
      return "linear-gradient(to right, #ffebcd, #ffe4b5)"; // Moderate light: light beige to moccasin
    } else if (lux >= 200) {
      return "linear-gradient(to right, #ffe4b5, #ffdead)"; // Dim light: moccasin to navajo white
    } else if (lux >= 100) {
      return "linear-gradient(to right, #ffdead, #f5deb3)"; // Very dim light: navajo white to wheat
    } else if (lux >= 40) {
      return "linear-gradient(to right, #f5deb3, #deb887)"; // Low light: wheat to burlywood
    } else {
      return "linear-gradient(to right, #deb887, #8b4513)"; // Very low light: burlywood to saddle brown
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
                {temperature > 31 && (
                  <i className="bi bi-brightness-high-fill"></i>
                )}
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
                    {brightness > 100
                      ? "High"
                      : brightness < 40
                      ? "Low"
                      : "Normal"}
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
