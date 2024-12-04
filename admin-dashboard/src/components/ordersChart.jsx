import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import axios from "axios";
import moment from "moment";
function OrdersChart({ ordersChartMonths, ordersChartGraph }) {
  const [orders, setOrders] = useState([]);
  const [monthsCount, setMonthsCount] = useState(ordersChartMonths);
  const [graph, setGraph] = useState(ordersChartGraph);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const now = moment().startOf("month");
  const getMonths = (n) => {
    let startMonth = moment().format("MMMM");
    let _months = [startMonth];
    for (let i = 1; i < n; i++) {
      let _month = now.subtract(1, "month").format("MMMM");
      _months.push(_month);
    }
    return _months;
  };

  const getOrderNumbers = (n, orders) => {
    let data = [];
    for (let j = 0; j < n; j++) {
      data.push(0);
    }
    for (let i = 0; i < orders.length; i++) {
      let order = orders[i];
      let create = moment(order.createAt).startOf("month");
      let now = moment().startOf("month");
      let duration = now.diff(create, "months");
      if (duration <= n) {
        data[duration] += 1;
      }
    }
    return data;
  };

  useEffect(() => {
    let months = getMonths(monthsCount);
    const getOrders = async () => {
      setIsLoading(true);
      let url = "http://localhost:3000/api/orders/all";
      try {
        let res = await axios.get(url);
        if (res.data.success && res.data.orders) {
          setOrders(res.data.orders);

          let myData = getOrderNumbers(monthsCount, res.data.orders);

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
                label: "Orders",
                backgroundColor: documentStyle.getPropertyValue("--blue-500"),
                borderColor: documentStyle.getPropertyValue("--blue-500"),
                data: myData,
                minBarLength: 1
              },
            ],
          };
          const options = {
            maintainAspectRatio: false,
            aspectRatio: 1,
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
    getOrders();
  }, [monthsCount]);

  useEffect(() => {
    setMonthsCount(ordersChartMonths);
  }, [ordersChartMonths]);
  useEffect(() => {
    setGraph(ordersChartGraph);
  }, [ordersChartGraph]);
  return (
    <div className="card">
      <Chart
        type={graph}
        data={chartData}
        options={chartOptions}
        className="w-full "
      />
    </div>
  );
}

export default OrdersChart;
