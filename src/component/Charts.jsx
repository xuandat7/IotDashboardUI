import React, { useState, useEffect, useRef } from "react";
import { Chart, registerables} from "chart.js";
import tempData from "../data/tempData.json";
import humidData from "../data/humidData.json";
import lightData from "../data/lightData.json";
import "./Charts.css";

function Charts() {
  Chart.register(...registerables);
  const [currentChart, setCurrentChart] = useState("temperature");
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    let chartData;
    switch (currentChart) {
      case "temperature":
        chartData = tempData;
        break;
      case "humidity":
        chartData = humidData;
        break;
      case "brightness":
        chartData = lightData;
        break;
      default:
        chartData = tempData;
    }
    const chart = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        title: {
          display: true,
          text: `${currentChart.charAt(0).toUpperCase()}${currentChart.slice(
            1
          )} Chart`,
        },
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true,
            title: {
              display: true,
              text: `${currentChart
                .charAt(0)
                .toUpperCase()}${currentChart.slice(1)}`,
            },
          },
          x: {
            type: 'category',
          },
        },
      },
    });
    return () => {
      chart.destroy();
    };
  }, [currentChart]);

  const handleChartChange = (chartType) => {
    setCurrentChart(chartType);
  };

  return (
    <section className="charts section">
      <div className="row">
        <div className="col-md-12 mt-5">
          <div className="card h-100">
            <div className="card-body" style={{ height: "400px" }}>
              {/* Chart 1 */}
              <canvas id="" ref={chartRef}></canvas>
              <div
                className="btn-group btn-group-toggle float-right mt-2 mx-2"
                // style={{ marginTop: -40 }}
              >
                <label className={currentChart === "temperature" ? "btn btn-secondary btn-sm active" : "btn btn-secondary btn-sm"}>
                  <button className="chart-btn"
                    type="button"
                    onClick={() => handleChartChange("temperature")}
                  ></button>
                  Temp
                </label>
                <label className={currentChart === "humidity" ? "btn btn-secondary btn-sm active" : "btn btn-secondary btn-sm"}>
                  <button className="chart-btn"
                    type="button"
                    onClick={() => handleChartChange("humidity")}
                  ></button>
                  Humid
                </label>
                <label className={currentChart === "brightness" ? "btn btn-secondary btn-sm active" : "btn btn-secondary btn-sm"}>
                  <button className="chart-btn"
                    type="button"
                    onClick={() => handleChartChange("brightness")}
                  ></button>
                  Bright
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Charts;