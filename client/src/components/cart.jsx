import { Button } from "primereact/button";
import React, { useState, useContext } from "react";
import { InputNumber } from "primereact/inputnumber";
import CartItem from "./cartItem";

function Cart(props) {
  return (
    <div className="p-2">
      <div className="page-title flex ">
        <p className="text-2xl mx-auto">Your Cart (5)</p>
      </div>
      <div className="cart-items flex flex-column">
        <CartItem/>
      </div>
    </div>
  );
}

export default Cart;
