import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Skeleton } from "primereact/skeleton";

function CustomersWidget(props) {
    const [customers, setCustomers] = useState([]);
    const [newCustomers, setNewCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
  
    const getNewCustomers = (customers, days) => {
      let now = moment();
      let _newCustomers = [];
      for (let i = 0; i < customers.length; i++) {
        let customer = customers[i];
        let create = moment(customer.createAt);
        let duration = now.diff(create, "days");
        if (duration <= days) {
          _newCustomers.push(customer);
        }
      }
      setNewCustomers(_newCustomers);
    };
  
    useEffect(() => {
      const getCustomers = async () => {
        setIsLoading(true);
        let url = "http://localhost:3000/api/users/all";
        try {
          let res = await axios.get(url);
          if (res.data.success && res.data.users) {
            setCustomers(res.data.users);
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
          setError(true);
        }
      };
      getCustomers();
    }, []);
  
    useEffect(() => {
      if (customers.length > 0) {
        getNewCustomers(customers, 7);
      }
    }, [customers]);
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
                  <span className="block text-500 font-medium mb-3">Customers</span>
                  <div className="text-900 font-medium text-xl">{customers.length}</div>
                </div>
                <div
                className="flex align-items-center justify-content-center bg-indigo-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-users text-indigo-500 text-xl"></i>
                </div>
              </div>
              <span className="text-green-500 font-medium">
                {newCustomers.length} new{" "}
              </span>
              <span className="text-500">since last week</span>
            </div>
          </div>
        )}
      </>
    );
}

export default CustomersWidget;