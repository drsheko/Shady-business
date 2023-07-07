import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../cartItem";
import { useShoppingCart } from "../../contexts/shoppingCartContext";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

function OrderSummary(props) {
  let navigate = useNavigate();
  const {
    shoppingList,
    shippingCost,
    shoppingListQty,
    cartTotalPrice,
    totalTax,
    orderTotalPrice,
  } = useShoppingCart();
  const [cartItems, setCartItems] = useState(shoppingList);
  const [promoCode, setPromoCode] = useState(null);

  const header = (
    <div className="flex flex-row p-3 justify-content-between align-items-center border-bottom-1 border-200 border-round-top">
      <p className="font-medium text-xl text-900"> Order Summary</p>
      <Button label="Edit" link onClick={() => navigate("/cart")} />
    </div>
  );
  const cartItem = (item) => {
    return (
      <div className="flex flex-row mt-3" key={item._id}>
        <div>
          <img src={item.photos[0]} alt="" width={64} height={64} />
        </div>
        <div className="flex flex-column px-3  w-full">
          <div className="flex flex-row justify-content-between w-full">
            <p className="text-800 capitalize text-lg">
              {item.inCart} X{" "}
              {item.status === "main" ? item.name : item.product.name}
            </p>
            <p className="text-800 align-self-end">$ {item.price}</p>
          </div>
          {item.status === "option" && (
            <p className="text-600 capitalize">Option: {item.name}</p>
          )}
        </div>
      </div>
    );
  };
  const footer = (
    <div className=" border-top-1 border-200">
      <div className="p-3 ">
        <div className="flex flex-row justify-content-between w-full my-2">
          <p className="text-800">Subtotal</p>
          <p className="text-800">$ {cartTotalPrice().toFixed(2)}</p>
        </div>
        <div className="flex flex-row justify-content-between w-full my-2">
          <p className="text-800">Shipping</p>
          <p className="text-800">
            {" "}
            {shippingCost ? `$ ${shippingCost}` : "______"}
          </p>
        </div>
        <div className="flex flex-row justify-content-between w-full my-2">
          <p className="text-800">Tax</p>
          <p className="text-800">$ {totalTax()}</p>
        </div>
        <div className="flex flex-column my-2">
          <p className="text-800 mb-2">Promo/Gift</p>
          <div className="flex flex-row w-full justify-content-between">
            <InputText
              name="promoCode"
              value={promoCode}
              onChange={(e) => setPromoCode(e.value)}
              className="w-full mr-2"
            />
            <Button label="Apply" outlined className="w-7rem" />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-content-between w-full my-2 border-top-1 border-200 p-4">
        <p className="text-800 text-lg">Total(USD)</p>
        <p className="text-800 font-bold text-3xl">$ {orderTotalPrice()}</p>
      </div>
    </div>
  );

  return (
    <div className="w-100 px-2 lg:px-3 flex flex-row justify-content-center md:justify-content-end">
      <Card
        footer={footer}
        header={header}
        pt={{
          root: { className: "border-1 border-200 w-full max-w-25rem" },
          body: { className: "p-0" },
        }}
      >
        {cartItems.length > 0 ? (
          <div className="overflow-y-auto px-2	max-h-16rem	">
            <p className="text-600 ml-3">{shoppingListQty()} item(s)</p>
            {cartItems.map((item) => {
              return cartItem(item);
            })}
          </div>
        ) : (
          ""
        )}
      </Card>
    </div>
  );
}

export default OrderSummary;
