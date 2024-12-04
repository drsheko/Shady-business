import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Skeleton } from "primereact/skeleton";

function OrdersWidget(props) {
  const [orders, setOrders] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const getNewOrders = (orders, days) => {
    let now = moment();
    let _newOrders = [];
    for (let i = 0; i < orders.length; i++) {
      let order = orders[i];
      let create = moment(order.createAt);
      let duration = now.diff(create, "days");
   
      if (duration <= days) {
        _newOrders.push(order);
      }
    }
    setNewOrders(_newOrders);
  };

  useEffect(() => {
    const getOrders = async () => {
      setIsLoading(true);
      let url = "http://localhost:3000/api/orders/all";
      try {
        let res = await axios.get(url);
        if (res.data.success && res.data.orders) {
          setOrders(res.data.orders);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        setError(true);
      }
    };
    getOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      getNewOrders(orders, 6);
    }
  }, [orders]);
  return (
    <>
      {isLoading || error ? (
        <div className="col-12 md:col-6 xl:col-3 p-2 ">
          <div className="card mb-0 p-3 shadow-2 border-round-lg bg-white">
            <div className="flex justify-content-between mb-3">
              <div>
                <Skeleton
                  width="9rem"
                  height="1rem"
                  className="mb-3"
                ></Skeleton>
                <Skeleton width="3.5rem" height="1.75rem"></Skeleton>
              </div>
              <Skeleton width="2.5rem" height="2.5rem"></Skeleton>
            </div>

            <Skeleton width="12rem" height="1rem"></Skeleton>
          </div>
        </div>
      ) : (
        <div className="col-12 md:col-6 xl:col-3 p-2 ">
          <div className="card mb-0 p-3 shadow-2 border-round-lg bg-white">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Orders</span>
                <div className="text-900 font-medium text-xl">{orders.length}</div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
              </div>
            </div>
            <span className="text-green-500 font-medium">
              {newOrders.length} new{" "}
            </span>
            <span className="text-500">since last visit</span>
          </div>
        </div>
      )}
    </>
  );
}

export default OrdersWidget;
