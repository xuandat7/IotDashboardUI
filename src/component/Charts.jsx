import React, { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import "./Charts.css";

function Charts() {
  Chart.register(...registerables);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Humidity (%)",
        data: [],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
      {
        label: "Brightness (lux)",
        data: [],
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        fill: true,
      },
    ],
  });

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/SensorData/allData", {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const latestData = Array.isArray(data) ? data[data.length - 1] : data;

      return {
        temperature: latestData.temperature,
        humidity: latestData.humidity,
        brightness: latestData.light,
        time: new Date(latestData.createdAt).toLocaleTimeString(), // Get the time from latest data
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Temperature, Humidity, and Brightness Chart",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Values",
            },
          },
          x: {
            title: {
              display: true,
              text: "Time",
            },
          },
        },
      },
    });

    const updateChart = async () => {
      const newData = await fetchData();

      if (newData) {
        setChartData((prevData) => {
          const updatedLabels = [...prevData.labels, newData.time];
          const updatedTempData = [...prevData.datasets[0].data, newData.temperature];
          const updatedHumidityData = [...prevData.datasets[1].data, newData.humidity];
          const updatedBrightnessData = [...prevData.datasets[2].data, newData.brightness];

          // Giới hạn chỉ hiển thị 10 điểm dữ liệu gần nhất
          if (updatedLabels.length > 10) {
            updatedLabels.shift();
            updatedTempData.shift();
            updatedHumidityData.shift();
            updatedBrightnessData.shift();
          }

          return {
            labels: updatedLabels,
            datasets: [
              { ...prevData.datasets[0], data: updatedTempData },
              { ...prevData.datasets[1], data: updatedHumidityData },
              { ...prevData.datasets[2], data: updatedBrightnessData },
            ],
          };
        });
      }
    };

    const intervalId = setInterval(updateChart, 5000); // Cập nhật dữ liệu mỗi 5 giây

    return () => {
      clearInterval(intervalId);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <section className="charts section">
      <div className="row">
        <div className="col-md-12 mt-3">
          <div className="card h-100">
            <div className="card-body" style={{ height: "520px" }}>
              <canvas id="combinedChart" ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Charts;
