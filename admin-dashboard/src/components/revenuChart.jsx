import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import axios from "axios";
import moment from "moment";

function RevenuChart({revenuChartMonths}) {
  const [monthsCount, setMonthsCount] = useState(revenuChartMonths);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const getMonths = (n) => {
    const now = moment().startOf("month");
    let startMonthName = moment().format("MMMM");
    let _monthsNames = [startMonthName];
    for (let i = 1; i < n; i++) {
      let _month = now.subtract(1, "month").format("MMMM");
      _monthsNames.push(_month);
    }
    return _monthsNames;
  };
  const getRevenuByMonths = (n, data) => {
    const now = moment().startOf("month");
    let startMonth = moment().format("YYYY/M");
    let _months = [startMonth];
    for (let i = 1; i < n; i++) {
      let _month = now.subtract(1, "month").format("YYYY/M");
      _months.push(_month);
    }
    let gross = [];
    let profit = [];
    for (let j = 0; j < _months.length; j++) {
      gross[j] = 0;
      profit[j] = 0;
      for (let k = 0; k < data.length; k++) {
        let date =
          data[k].date.createdAtYear + "/" + data[k].date.createdAtMonth;
        if (_months[j] === date) {
          gross[j] = Math.round(data[k].gross);
          profit[j] = Math.round(data[k].profit);
          break;
        }
      }
    }
    return { gross, profit };
  };

  useEffect(() => {
    let months = getMonths(monthsCount);
    const getRevenu = async () => {
      setIsLoading(true);
      let url = "http://localhost:3000/api/orders/revenu";
      try {
        let res = await axios.post(url);
        if (res.data.success && res.data.data) {
          let revenuData = getRevenuByMonths(monthsCount, res.data.data);
          let gross = revenuData.gross;
          let profit = revenuData.profit;
          const documentStyle = getComputedStyle(document.documentElement);
          const textColor = documentStyle.getPropertyValue("--text-color");
          const textColorSecondary = documentStyle.getPropertyValue(
            "--text-color-secondary"
          );
          const surfaceBorder =
            documentStyle.getPropertyValue("--surface-border");
          const data = {
            labels: months,
            datasets: [
              {
                label: "Gross",
                backgroundColor: documentStyle.getPropertyValue("--blue-500"),
                borderColor: documentStyle.getPropertyValue("--blue-500"),
                data: gross,
                minBarLength: 1
              },
              {
                label: "Profit",
                backgroundColor: documentStyle.getPropertyValue("--red-500"),
                borderColor: documentStyle.getPropertyValue("--red-500"),
                data: profit,
                minBarLength: 1
              },
            ],
          };
          const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
              legend: {
                position:"bottom",
                labels: {
                  fontColor: textColor,
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: textColorSecondary,
                  font: {
                    weight: 500,
                  },
                },
                grid: {
                  display: false,
                  drawBorder: false,
                },
              },
              y: {
                ticks: {
                  color: textColorSecondary,
                  beginAtZero: true,
                  min: 0,
                  suggestedMin: 0,
                },
                grid: {
                  color: surfaceBorder,
                  drawBorder: false,
                },
              },
            },
          };
          setChartData(data);
          setChartOptions(options);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        setError(true);
      }
    };
    getRevenu();
  }, [monthsCount]);

  useEffect(() => {
    setMonthsCount(revenuChartMonths);
  }, [revenuChartMonths]);

  return (
    <div >
      <Chart
        type="bar"
        data={chartData}
        options={chartOptions}
        className="w-full max-h-full "
      />
    </div>
  );
}

export default RevenuChart;
