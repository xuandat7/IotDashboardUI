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

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/SensorData/sort?sortField=createdAt&sortOrder=desc&page=1&limit=10",
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

      return data.rows.map((item) => ({
        temperature: item.temperature,
        humidity: item.humidity,
        brightness: item.light,
        time: new Date(item.createdAt).toLocaleTimeString(),
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
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
            font: {
              size: 18,
              family: "'Poppins', sans-serif",
              weight: "bold",
            },
            padding: {
              top: 20,
              bottom: 20,
            },
            color: "#333",
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

      if (newData.length > 0) {
        setChartData((prevData) => {
          const updatedLabels = newData.map((item) => item.time).reverse();
          const updatedTempData = newData
            .map((item) => item.temperature)
            .reverse();
          const updatedHumidityData = newData
            .map((item) => item.humidity)
            .reverse();
          const updatedBrightnessData = newData
            .map((item) => item.brightness)
            .reverse();

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

    const intervalId = setInterval(updateChart, 5000);

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
        <div className="col-md-12 mt-3 p-3">
          <div className="card chart-card shadow">
            <div className="card-body" style={{ height: "400px" }}>
              <canvas id="combinedChart" ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Charts;
