import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { UserContext } from "../App";
import { Dialog } from "primereact/dialog";
import { AccountIndexContext } from "./account";
import OrderCard from "./orderCard";

function Orders(props) {
  const navigate = useNavigate();
  let {setActiveIndex} = useContext(AccountIndexContext)
  setActiveIndex(0)
  const { user, setUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const cartItem = (item) => {
    let isOption = item.option ? true : false;
    let regPrice = isOption ? item.option.price : item.product.price;

    return (
      <div className="flex flex-row mt-3" key={item.product._id}>
        <div>
          <img
            src={item.option ? item.option.photos[0] : item.product.photos[0]}
            alt=""
            width={64}
            height={64}
          />
        </div>
        <div className="flex flex-column px-3 align-self-center w-full">
          <div className="flex flex-row justify-content-between w-full">
            <div className="flex flex-column">
              <div className="flex flex-row ">
                <p className="text-800 capitalize text-lg">{item.quantity} X</p>
                <p className="text-800 capitalize text-lg">
                  {item.product.name}
                </p>
              </div>
              {item.option && (
                <p className="text-600 capitalize text-lg">
                  {item.option.name}
                </p>
              )}
            </div>
            {item.price < regPrice ? (
              <div>
                <p className="text-600 line-through">${regPrice}</p>
                <span className="text-800 ">${item.price}</span>
              </div>
            ) : (
              <p className="text-800 ">${item.price}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const getOrders = async () => {
      let server = "https://shady-business-server.onrender.com";
      let url = server+ "/api/orders/user/all";
      try {
        if (user) {
          let res = await axios.post(url, { userId: user._id });
          if (res.data.success && res.data.orders) {
            setOrders(res.data.orders);
          }
        }
      } catch (error) {}
    };
    getOrders();
  }, []);
  useEffect(() => {
    if (selectedOrder) {
      setDialogVisible(true);
    }
  }, [selectedOrder]);
  return (
    <div>
      {orders.length > 0 ? (
        <div className="px-2 sm:px-3 md:px-4 lg:px-6">
          {orders.map((order) => {
            return <OrderCard order={order}/>
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Orders;
