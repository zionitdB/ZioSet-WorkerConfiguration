import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const AreaChart = (props) => {
  const series = [
    {
      name: props.name || "Data",
      data: props.data || [40, 0, 0, 0, 0, 0, 0, , 0, 0, 0 , 100],
    },
  ];

  //const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [chartColors, setChartColors] = useState(["#008FFB"]);

  const options = {
    series: series,
    chart: {
      type: "area",
      height: 350,
      zoom: {
        enabled: false,
      },
      background: {
        foreColor: "transparent",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: props.title || "",
      align: "left",
    },
    subtitle: {
      text: props.text,
      align: "left",
    },
    labels: props.labels || [
      "2022-01-01",
      "2022-02-01",
      "2022-03-01",
      "2022-04-01",
      "2022-05-01",
      "2022-06-01",
      "2022-07-01",
      "2022-08-01",
      "2022-09-01",
      "2022-10-01",
    ],
    xaxis: {
      type: "categories", 
      grid: {
        show: false, // Hide x-axis grid lines
      },
    },
    yaxis: {
      opposite: true,
      grid: {
        show: false, // Hide y-axis grid lines
      },
    },
    legend: {
      horizontalAlign: "left",
    },
   theme: {
      mode: document.body.classList.contains("dark") ? "dark" : "light", // Set the theme mode based on body class
      monochrome: {
        enabled: true,
        color: chartColors[0],
        shadeTo: "light",
        shadeIntensity: 0.9,
      },
    },
  };
  

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setChartColors((prevColors) => {
        return prevColors[0] === "#008FFB" ? ["#FF4560"] : ["#008FFB"];
      });
    }, 3000);

    return () => clearInterval(colorInterval);
  }, []);

  const handleYearChange = (event) => {
    props.setSelectedYear(event.target.value);
    //
    //
  };

  // Dynamically generate the last four years
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_, i) => (currentYear - i).toString());

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ alignSelf: "flex-end" }}>
      {props.yearSelect && (
          <div>
            <label htmlFor="yearSelect">Select Year: </label>
            <select
              id="yearSelect"
              onChange={handleYearChange}
              value={props.selectedYear}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div id="chart">
        <ReactApexChart options={options} series={options.series} type="area" height={300} />
      </div>
    </div>
  );
};

export default AreaChart;
