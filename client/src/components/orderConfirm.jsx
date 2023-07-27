import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

function OrderConfirm(props) {
  let order = useLocation().state;
  let navigate = useNavigate();

  const cartItem = (item) => {
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

  return (
    <div className="p-3">
      <p className="text-5xl text-center font-medium mb-3">
        <i className="pi pi-check text-green-500 font-bold border-circle border-3 text-3xl p-2"></i>{" "}
        Thank you!
      </p>
      <p className="text-xl font-normal text-700 my-1	text-center">
        {" "}
        Your order <span className="font-semibold text-primary">#{order._id}</span> has
        been placed.
      </p>
      <p className="text-base font-light text-700 text-center">
        We sent an email to{" "}
        <span className="font-semibold text-primary">{order.user.email}</span>{" "}
        with your order confirmation and receipt.If the email hasn't arrived
        within two minutes,please check your span folder.
      </p>
      <div className="flex flex-column  align-items-center gap-1 my-5">
        <Card
          pt={{
            root: { className: "border-1 border-200 w-full max-w-25rem" },
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

      <div className="card flex flex-column md:flex-row justify-content-between shadow-2 my-4 p-3 border-round">
        <div className="flex flex-column my-2">
          <p className="text-lg mb-1"> Shipping To</p>
          <p className="m-0 capitalize text-800">
            {order.user.firstName} {order.user.lastName}
          </p>
          <p className="text-800">{order.user.phone}</p>
          <p className="text-800">{order.shipping.address.line1}</p>
          <p className="text-800">{order.shipping.address.line2}</p>
          <p className="text-800">
            {order.shipping.address.city},{order.shipping.address.state},
            {order.shipping.address.zipcode} / {order.shipping.address.country}{" "}
          </p>
        </div>
        <div className="border-1 border-100 m-2 sm:mx-4 md:m-2"></div>
        <div className="flex flex-column my-2">
          <p className="text-lg mb-1"> Billing info</p>
          <p className="m-0 capitalize text-800">
            {order.user.firstName} {order.user.lastName}
          </p>
          <p className="text-800">{order.user.phone}</p>
          <p className="text-800">{order.billingAddress.line1}</p>
          <p className="text-800">{order.billingAddress.line2}</p>
          <p className="text-800">
            {order.billingAddress.city},{order.billingAddress.state},
            {order.billingAddress.zipcode} / {order.billingAddress.country}{" "}
          </p>
        </div>
        <div className="border-1 border-100 m-2 "></div>
        <div className="flex flex-column">
          <p className="text-lg mb-2"> Payment Info</p>
          <p className="text-800">Card</p> <br />
          <p className="text-800">
            {"************" + order.payment.cardNumber.toString().slice(-4)}
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-content-center">
        <Button
          label="Continue shopping"
          size="small"
          onClick={() => navigate("/")}
        />
      </div>
    </div>
  );
}

export default OrderConfirm;
