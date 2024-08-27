import React, { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import combinedData from "../data/combinedData.json";
import "./Charts.css";

function Charts() {
  Chart.register(...registerables);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const fetchData = () => {
    // Simulate fetching new data
    const newTemperature = Math.floor(Math.random() * 10) + 20;
    const newHumidity = Math.floor(Math.random() * 20) + 30;
    const newBrightness = Math.floor(Math.random() * 100) + 100;

    return {
      temperature: newTemperature,
      humidity: newHumidity,
      brightness: newBrightness,
      time: new Date().toLocaleTimeString()
    };
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: combinedData.labels,
        datasets: combinedData.datasets
      },
      options: {
        title: {
          display: true,
          text: "Temperature, Humidity, and Brightness Chart",
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

    const updateChart = () => {
      const newData = fetchData();

      // Update data arrays
      combinedData.labels.push(newData.time);
      combinedData.datasets[0].data.push(newData.temperature);
      combinedData.datasets[1].data.push(newData.humidity);
      combinedData.datasets[2].data.push(newData.brightness);

      // Keep only the last 15 data points
      if (combinedData.labels.length > 10) {
        combinedData.labels.shift();
        combinedData.datasets[0].data.shift();
        combinedData.datasets[1].data.shift();
        combinedData.datasets[2].data.shift();
      }

      // Update chart
      chartInstanceRef.current.data.labels = combinedData.labels;
      chartInstanceRef.current.data.datasets.forEach((dataset, index) => {
        dataset.data = combinedData.datasets[index].data;
      });
      chartInstanceRef.current.update();
    };

    const intervalId = setInterval(updateChart, 5000);

    return () => {
      clearInterval(intervalId);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

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