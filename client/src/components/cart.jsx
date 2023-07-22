import { Button } from "primereact/button";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "./cartItem";
import { useShoppingCart } from "../contexts/shoppingCartContext";

function Cart(props) {
  const navigate = useNavigate();
  const {
    shoppingList,
    discountedShoppingList,
    getItemQty,
    increaseQty,
    decreaseQty,
    removeItem,
    shippingCost,
    setShippingCost,
    shoppingListQty,
    itemTotalPrice,
    cartTotalPrice,
    cartTotalPriceAfterDiscount,
    totalTax,
    orderTotalPrice,
    couponError,
    setCouponError,
    discount,
    coupon,
    clipCoupon,
    unClipCoupon,
    couponCode,
    setCouponCode,
  } = useShoppingCart();
  return (
    <div className="p-2">
      <div className="page-title flex ">
        <p className="text-2xl mx-auto mb-6 mt-3">
          Your Cart ({shoppingListQty()})
        </p>
      </div>
      {shoppingList.length > 0 ? (
        <>
          <div className="cart-items flex flex-column">
            <div className="items-title hidden lg:block ">
              <div className=" flex flex-row justify-content-between align-items-center px-4 text-400">
                <tb className="col-4">Item</tb>
                <tb>Price</tb>
                <div>Quantity</div>
                <div>Total</div>
              </div>
              <div className="border-1  text-200"></div>
            </div>
            {coupon && discountedShoppingList.length > 0
              ? discountedShoppingList.map((product) => {
                  return <CartItem product={product} />;
                })
              : shoppingList.length > 0
              ? shoppingList.map((product) => {
                  return <CartItem product={product} />;
                })
              : ""}
          </div>

          <div className="checkout col-10 sm:col-9 md:col-7 lg:col-6 mt-4 mx-auto md:mr-0 md:ml-auto">
            <div className="subtotal flex flex-row justify-content-between p-3 text-400">
              <p>Subtotal:</p>
              <p className="text-900">${cartTotalPrice().toFixed(2)}</p>
            </div>
            <div className="border-1 px-2 text-100"></div>
            <div className="shipping flex flex-row justify-content-between p-3 text-400">
              <p>Shipping:</p>
              <p className="text-900">{shippingCost?`$ ${shippingCost}`:"----"}</p>
            </div>
            <div className="border-1 px-2 text-100"></div>
            <div className="shipping flex flex-row justify-content-between p-3 text-400">
              <p>Coupon Code:</p>
              <p className="underline font-semibold cursor-pointer text-800">
                Add coupon
              </p>
            </div>
            <div className="border-1 px-2 text-100"></div>
            <div className=" flex flex-row justify-content-between p-3 text-400">
              <p>Grand total:</p>
              <p className="text-900">${cartTotalPriceAfterDiscount()}</p>
            </div>
            <Button
              label="Checkout"
              className="w-full my-3"
              onClick={() => navigate("/checkout")}
            />
          </div>
        </>
      ) : (
        <p className="ml-3 text-xl text-center">Your cart is empty</p>
      )}
    </div>
  );
}

export default Cart;
