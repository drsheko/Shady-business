import React, { useEffect, useState } from "react";
import CustomersWidget from "./customersWidget";
import OrdersChart from "./ordersChart";
import OrdersWidget from "./ordersWidget";
import { Dropdown } from "primereact/dropdown";
import BestSellerProducts from "./bestSellerProducts";
import BestSellerCategories from "./bestSellerCategories";
import RevenuChart from "./revenuChart";

function Dashboard(props) {
  const [ordersChartMonths, setOrdersChartMonths] = useState(3);
  const [revenuChartMonths, setRevenuChartMonths] = useState(3);
  const [ordersChartGraph, setOrdersChartGraph] = useState("bar");
  let monthsOptions = [
    { name: "Last Month", value: 1 },
    { name: "Last 2 Months", value: 2 },
    { name: "Last 3 Months", value: 3 },
    { name: "Last 4 Months", value: 4 },
    { name: "Last 5 Months", value: 5 },
    { name: "Last 6 Months", value: 6 },
    { name: "Last 9 Months", value: 9 },
    { name: "Last Year", value: 12 },
  ];
  return (
    <div className="h-full">
      <div className="grid">
        <CustomersWidget />
        <div class="col-12 md:col-6 xl:col-3 p-2 ">
          <div class="card mb-0 p-3 shadow-2 border-round-lg bg-white">
            <div class="flex justify-content-between mb-3">
              <div>
                <span class="block text-500 font-medium mb-3">Revenue</span>
                <div class="text-900 font-medium text-xl">$1520</div>
              </div>
              <div
                class="flex align-items-center justify-content-center bg-green-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i class="pi pi-dollar text-green-500 text-xl"></i>
              </div>
            </div>
            <span class="text-green-500 font-medium">24 new </span>
            <span class="text-500">since last week</span>
          </div>
        </div>

        <div class="col-12 md:col-6 xl:col-3 p-2 ">
          <div class="card mb-0 p-3 shadow-2 border-round-lg bg-white">
            <div class="flex justify-content-between mb-3">
              <div>
                <span class="block text-500 font-medium mb-3">Reviews</span>
                <div class="text-900 font-medium text-xl">520</div>
              </div>
              <div
                class="flex align-items-center justify-content-center bg-pink-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i class="pi pi-comments text-pink-500 text-xl"></i>
              </div>
            </div>
            <span class="text-green-500 font-medium">24 new </span>
            <span class="text-500">since last week</span>
          </div>
        </div>

        <OrdersWidget />

        <div className="col-12 grid p-0 m-0 ">
          <div className="col-12 md:col-7  p-2">
            <div className="card mb-0 p-3 shadow-2 border-round-lg bg-white md:min-h-full">
              <div className="w-full flex justify-content-between mb-3">
                <p className="font-semibold  text-lg">Orders count</p>

                <div className=" flex flex-column align-items-end mb-3">
                  <Dropdown
                    value={ordersChartGraph}
                    onChange={(e) => setOrdersChartGraph(e.value)}
                    options={["bar", "line"]}
                    pt={{
                      root: {
                        className: " m-1 max-w-min ml-auto",
                      },
                      item: { className: "uppercase" },
                      input: { className: "uppercase p-2 max-w-min " },
                    }}
                    placeholder="Chart"
                    className="w-full md:w-8rem"
                  />
                  <Dropdown
                    value={ordersChartMonths}
                    onChange={(e) => setOrdersChartMonths(e.value)}
                    options={monthsOptions}
                    optionLabel="name"
                    placeholder="months"
                    className="w-full md:w-12rem"
                    pt={{
                      root: {
                        className: "m-1 max-w-min",
                      },
                      input: {
                        className: "p-2 max-w-min",
                      },
                    }}
                  />
                </div>
              </div>
              <div className="max-h-25rem">
              <OrdersChart
                ordersChartMonths={ordersChartMonths}
                ordersChartGraph={ordersChartGraph}
              />
              </div>
            </div>
          </div>
          <BestSellerProducts />
        </div>
        <div className="col-12 grid p-0 m-0">
          <BestSellerCategories />
          <div className="col-12 md:col-7  p-2">
            <div className="card mb-0 p-3 shadow-2 border-round-lg bg-white">
              <div className="w-full flex justify-content-between mb-3">
                <p className="font-semibold  text-lg">Revenue Overview</p>

                <Dropdown
                  value={revenuChartMonths}
                  onChange={(e) => setRevenuChartMonths(e.value)}
                  options={monthsOptions}
                  optionLabel="name"
                  placeholder="months"
                  className="align-self-center"
                  pt={{
                    root: {
                      className: "m-1 max-w-min align-self-center",
                    },
                    input: {
                      className: "p-2 max-w-min",
                    },
                  }}
                />
              </div>
              <div className="max-h-25rem">
                <RevenuChart revenuChartMonths={revenuChartMonths} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
