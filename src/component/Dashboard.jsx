import React, { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [wind, setWind] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/SensorData?page=1&limit=1&sortField=createdAt&sortOrder=DESC",
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

  const fetchWind = async () => {
    try {
      const response = await fetch("http://localhost:3001/wind/now", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setWind(data.windSpeed);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const updateData = () => {
      fetchData();
      fetchWind();
    };

    // Gọi fetch data ngay khi component mount
    updateData();

    // Thiết lập interval để gọi API mỗi 2 giây
    const intervalId = setInterval(updateData, 2000);

    // Cleanup interval khi component bị unmount
    return () => clearInterval(intervalId);
  }, []);

  const getTemperatureGradient = (temp) => {
    if (temp < 0) {
      return "linear-gradient(to right, #1E90FF, #87CEFA)"; // Rất lạnh: Xanh dương đậm đến xanh dương nhạt
    } else if (temp < 10) {
      return "linear-gradient(to right, #87CEFA, #E0FFFF)"; // Lạnh: Xanh dương nhạt đến xanh lơ nhạt
    } else if (temp < 18) {
      return "linear-gradient(to right, #E0FFFF, #98FB98)"; // Mát mẻ: Xanh lơ nhạt đến xanh lá cây nhạt
    } else if (temp < 25) {
      return "linear-gradient(to right, #98FB98, #FAFAD2)"; // Ấm áp: Xanh lá cây nhạt đến vàng nhạt
    } else if (temp < 30) {
      return "linear-gradient(to right, #FAFAD2, #FFA07A)"; // Hơi nóng: Vàng nhạt đến cam nhạt
    } else if (temp < 35) {
      return "linear-gradient(to right, #FFA07A, #FF6347)"; // Nóng: Cam nhạt đến đỏ cam
    } else {
      return "linear-gradient(to right, #FF6347, #DC143C)"; // Rất nóng: Đỏ cam đến đỏ thẫm
    }
  };

  const getHumidityGradient = (humid) => {
    if (humid > 70) return "linear-gradient(to right, #3a7bd5, #3a6073)";
    if (humid < 30) return "linear-gradient(to right, #f6d365, #fda085)";
    return "linear-gradient(to right, #89f7fe, #66a6ff)";
  };

  const getLightGradient = (lux) => {
    if (lux >= 1000) {
      return "linear-gradient(to right, #FFD700, #FFFF00)"; // Rất sáng: Vàng đậm đến vàng
    } else if (lux >= 700) {
      return "linear-gradient(to right, #FFA500, #FFD700)"; // Sáng: Cam đến vàng đậm
    } else if (lux >= 400) {
      return "linear-gradient(to right, #FF8C00, #FFA500)"; // Khá sáng: Cam đậm đến cam
    } else if (lux >= 200) {
      return "linear-gradient(to right, #FF4500, #FF8C00)"; // Trung bình: Đỏ cam đến cam đậm
    } else if (lux >= 100) {
      return "linear-gradient(to right, #8B4513, #FF4500)"; // Hơi tối: Nâu đỏ đến đỏ cam
    } else if (lux >= 40) {
      return "linear-gradient(to right, #4B3621, #8B4513)"; // Tối: Nâu sẫm đến nâu đỏ
    } else {
      return "linear-gradient(to right, #1C1C1C, #4B3621)"; // Rất tối: Đen gần như hoàn toàn đến nâu sẫm
    }
  };

  const getWindGradient = (wind) => {
    // m/s
    if (wind > 10) return "linear-gradient(to right, #f00, #ff0)";
    if (wind < 5) return "linear-gradient(to right, #00f, #0ff)";
    return "linear-gradient(to right, #0f0, #ff0)";
  };

  return (
    <div className="dashboard">
      <div className="row">
        {/* Temperature Card */}
        <div className="col-lg-3">
          <div
            className="card"
            style={{
              background: getTemperatureGradient(temperature),
            }}
          >
            <div className="card-body">
              <i className="bi bi-thermometer icon"></i>
              <div className="card-content">
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
              {temperature < 14 && <i className="bi bi-snow2 status-icon"></i>}
              {temperature > 31 && (
                <i className="bi bi-brightness-high-fill status-icon"></i>
              )}
            </div>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="col-md-3">
          <div
            className="card"
            style={{
              background: getHumidityGradient(humidity),
            }}
          >
            <div className="card-body">
              <i className="bi bi-moisture icon"></i>
              <div className="card-content">
                <h5>{humidity}%</h5>
                <p>Độ ẩm</p>
                <small className="text-muted">
                  {humidity > 70 ? "High" : humidity < 30 ? "Low" : "Normal"}
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Brightness Card */}
        <div className="col-md-3">
          <div
            className="card"
            style={{
              background: getLightGradient(brightness),
            }}
          >
            <div className="card-body">
              <i className="bi bi-brightness-high icon"></i>
              <div className="card-content">
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
        <div className="col-md-3">
          <div
            className="card"
            style={{
              background: getWindGradient(wind),
            }}
          >
            <div className="card-body">
              <i className="bi bi-brightness-high icon"></i>
              <div className="card-content">
                <h5>{wind} m/s</h5>
                <p>Wind Speed</p>
                <small className="text-muted">
                  {wind > 7 ? "High" : wind < 4 ? "Low" : "Normal"}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
