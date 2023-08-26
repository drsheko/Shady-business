import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { UserContext } from "../App";
import { Dialog } from "primereact/dialog";

function Orders(props) {
  const navigate = useNavigate();
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
  useEffect(() => {
    if (selectedOrder) {
      setDialogVisible(true);
    }
  }, [selectedOrder]);
  return (
    <div>
      {orders.length > 0 ? (
        <>
          {orders.map((order) => {
            return (
              <div class="surface-card grid grid-nogutter border-round shadow-2 mt-3">
                <div class="col-12 flex  flex-column sm:flex-row p-2 surface-100 border-round-top">
                  <div class="p-1 sm:p-2 flex-auto text-center sm:text-left">
                    <span class="text-sm sm:text-base text-700 block">
                      Order Number
                    </span>
                    <span class="text-sm sm:text-base text-900 font-medium block mt-1 sm:mt-2">
                      {order._id}
                    </span>
                  </div>

                  <div class="p-1 sm:p-2 flex-auto text-center sm:text-left">
                    <span class="text-sm sm:text-base text-700 block">
                      Order Date
                    </span>
                    <span class="text-sm sm:text-base text-900 font-medium block mt-1 sm:mt-2">
                      {moment(order.createAt).format("D MMMM yy")}
                    </span>
                  </div>

                  <div class="p-1 sm:p-2 flex-auto text-center sm:text-left">
                    <span class="text-sm sm:text-base text-700 block">
                      Total Amount
                    </span>
                    <span class="text-sm sm:text-base text-900 font-medium block mt-1 sm:mt-2">
                      ${order.total}
                    </span>
                  </div>
                </div>
                {order.products.length > 0 &&
                  order.products.map((product) => {
                    return (
                      <div class="col-12">
                        <div class="p-2 my-4 flex flex-column lg:flex-row justify-content-between align-items-center">
                          <div class="flex flex-column lg:flex-row justify-content-center align-items-center px-2">
                            <img
                              src={
                                product.option
                                  ? product.option.photos[0]
                                  : product.product.photos[0]
                              }
                              alt="product"
                              class="w-8rem h-8rem lg:mr-3 flex-shrink-0"
                            />
                            <div class="flex flex-column my-auto  text-center lg:text-left">
                              <span class="text-900 font-semibold mb-3 mt-3 lg:mt-0 capitalize">
                                {product.product.name}
                              </span>
                              {product.option && (
                                <span class="text-600 text-sm mb-3 capitalize">
                                  Option: {product.option.name}
                                </span>
                              )}
                              <div className="block lg:hidden flex flex-column justify-content-center align-items-center">
                                <div className="  mb-1">
                                  <p className="text-600 font-medium">
                                    Price:
                                    <span className="ml-1 ">
                                      ${product.price}
                                    </span>
                                  </p>
                                </div>
                                <div className="  mb-3">
                                  <p className="text-600 font-medium">
                                    Quantity:
                                    <span className="ml-1">
                                      {product.quantity}pcs
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <p
                                onClick={() =>
                                  navigate(
                                    `/product/${product.product.name}/${product.product._id}`
                                  )
                                }
                                class="p-ripple p-2 cursor-pointer w-9rem mx-auto lg:mx-0 border-round font-medium text-center border-1 border-primary text-primary transition-duration-150 hover:bg-primary"
                              >
                                Buy Again
                                <span
                                  role="presentation"
                                  class="p-ink"
                                  style={{ height: " 144px", width: "144px" }}
                                ></span>
                              </p>
                            </div>
                          </div>
                          <div className="hidden lg:block">
                            <div className=" mr-5 my-2">
                              <p className="text-600 font-semibold">
                                Price:
                                <span className="ml-1 ">${product.price}</span>
                              </p>
                            </div>
                            <div className=" mr-5 my-2">
                              <p className="text-600 font-semibold">
                                Quantity:
                                <span className="ml-1">
                                  {product.quantity}pcs
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <p-divider classname="w-full block lg:hidden surface-border"></p-divider>
                      </div>
                    );
                  })}

                <div class="col-12 p-0 flex border-top-1 surface-border">
                  <a
                    tabIndex="0"
                    class="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center font-medium text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
                    style={{ borderBottomLeftRadius: "6px" }}
                  >
                    <i class="pi pi-folder mr-2 mb-2 md:mb-0"></i>Archive Order
                  </a>
                  <a
                    tabIndex="0"
                    class="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center font-medium text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
                  >
                    <i class="pi pi-refresh mr-2 mb-2 md:mb-0"></i>Return
                  </a>
                  <p
                    onClick={() => {
                      setSelectedOrder(order);
                    }}
                    class="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center font-medium text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
                  >
                    <i class="pi pi-file mr-2 mb-2 md:mb-0"></i>View Invoice
                  </p>
                  <a
                    tabIndex="0"
                    class="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center font-medium text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
                    style={{ borderBottomRightRadius: "6px" }}
                  >
                    <i class="pi pi-comment mr-2 mb-2 md:mb-0"></i>Write a
                    Review
                  </a>
                </div>
                <Dialog
                  header="Order Invoice"
                  visible={dialogVisible}
                  onHide={() => {
                    setDialogVisible(false);
                    setSelectedOrder(null);
                  }}
                  draggable={false}
                  style={{ minWidth: "70%" }}
                  pt={{
                    header: {
                      className: "surface-100",
                    },
                  }}
                >
                  {selectedOrder && (
                    <div>
                      {selectedOrder.products.length > 0 ? (
                        <div className="overflow-y-auto px-2	max-h-16rem	">
                          {selectedOrder.products.map((item) => {
                            return cartItem(item);
                          })}
                          <div className="border-1 border-100 m-2 "></div>
                          <div className="flex flex-row justify-content-between  mx-4 my-1">
                            <p className="text-800">Subtotal</p>
                            <p className="text-800">
                              $
                              {selectedOrder.products
                                .reduce(
                                  (acc, el) =>
                                    acc +
                                    (el.option
                                      ? el.option.price
                                      : el.product.price) *
                                      el.quantity,
                                  0
                                )
                                .toFixed(2)}
                            </p>
                          </div>
                          {selectedOrder.discount && (
                            <div className="flex flex-row justify-content-between  mx-4 my-1">
                              <p className="text-red-500">Discount</p>
                              <p className="text-red-500">
                                - ${selectedOrder.discount}
                              </p>
                            </div>
                          )}
                          <div className="flex flex-row justify-content-between  mx-4 my-1">
                            <p className="text-800">Tax</p>
                            <p className="text-800">${selectedOrder.tax}</p>
                          </div>

                          <div className="flex flex-row justify-content-between  mx-4 my-1">
                            <p className="text-800">Shipping</p>
                            <p className="text-800">
                              ${selectedOrder.shipping.cost}
                            </p>
                          </div>
                          <div className="flex flex-row justify-content-between  mx-4 my-1">
                            <p className="text-800">Total</p>
                            <p className="text-800">${selectedOrder.total}</p>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </Dialog>
              </div>
            );
          })}
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Orders;
