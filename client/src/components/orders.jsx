import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { Card } from "primereact/card";

function Orders(props) {
  const { user, setUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const cartItem = (item) => {
    console.log(item)
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
            <p className="text-800 ">${item.price}</p>
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    const getOrders = async () => {
      let url = "http://localhost:3000/api/orders/user/all";
      try {
        if (user) {
          let res = await axios.post(url, { userId: user._id });
          if (res.data.success && res.data.orders) {
            setOrders(res.data.orders);
            console.log(res.data.orders);
          }
        }
      } catch (error) {}
    };
    getOrders();
  }, []);

  return (
    <div>
      {orders.length > 0 ? (
        <div>
          {orders.map((order) => {
            return (
              <div>
                <Card
                  pt={{
                    root: {
                      className: "border-1 border-200 w-full max-w-25rem",
                    },
                    body: { className: "p-0" },
                  }}
                >
                  {order.products.length > 0 ? (
                    <div className="overflow-y-auto px-2	max-h-16rem	">
                      {order.products.map((item) => {
                        return cartItem(item);
                      })}
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="border-1 border-100 m-2 "></div>
                  {order.discount && (
                    <div className="flex flex-row justify-content-between  mx-4 my-1">
                      <p className="text-red-500">Discount</p>
                      <p className="text-red-500">- ${order.discount}</p>
                    </div>
                  )}
                  <div className="flex flex-row justify-content-between  mx-4 my-1">
                    <p className="text-800">Tax</p>
                    <p className="text-800">${order.tax}</p>
                  </div>
                  <div className="flex flex-row justify-content-between  mx-4 my-1">
                    <p className="text-800">Shipping</p>
                    <p className="text-800">${order.shipping.cost}</p>
                  </div>
                  <div className="flex flex-row justify-content-between  mx-4 my-1">
                    <p className="text-800">Total</p>
                    <p className="text-800">${order.total}</p>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Orders;
