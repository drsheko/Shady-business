import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "./cartItem";
import { useShoppingCart } from "../contexts/shoppingCartContext";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

function Cart(props) {
  const navigate = useNavigate();
  const [couponVisible, setCouponVisible] = useState(false);
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
  const [promoCode, setPromoCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [promoCodeSubmitted, setPromoCodeSubmitted] = useState(false);
  const handleChange = (e) => {
    setCouponError(null);
    setPromoCode(e.target.value.toLowerCase());
    e.target.value.trim !== "" ? setCodeError(false) : "";
  };

  const handleSubmitPromoCode = () => {
    if (promoCode.trim() === "") {
      setCodeError(true);
      return;
    }

    setCouponCode(promoCode);

    clipCoupon(promoCode);
    if (couponError) {
      setCouponCode(null);
      setCodeError(true);
      setPromoCodeSubmitted(false);
    } else {
      setPromoCodeSubmitted(true);
    }
  };
  useEffect(() => {
    if (couponError) {
      setCouponCode(null);
      setPromoCodeSubmitted(false);
    }
  }, [couponError]);
  const handleRemovePromoCode = () => {
    setPromoCodeSubmitted(false);
    unClipCoupon();
    setPromoCode("");
    setCouponCode(null);
  };
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
            {discount ? (
              <>
                <div className="flex flex-row justify-content-between p-3 text-400">
                  <p>Discount</p>
                  <p className="text-red-500">$ -{discount}</p>
                </div>
                <div className="border-1 px-2 text-100"></div>
                <div className="flex flex-row justify-content-between p-3 text-400">
                  <p>After discount:</p>
                  <p className="text-900">${cartTotalPriceAfterDiscount()}</p>
                </div>
                <div className="border-1 px-2 text-100"></div>
              </>
            ) : (
              ""
            )}

            <div className=" flex flex-row justify-content-between p-3 text-400">
              <p>Tax:</p>
              <p className="text-900">${totalTax()}</p>
            </div>
            <div className="border-1 px-2 text-100"></div>
            <div className="shipping flex flex-row justify-content-between p-3 text-400">
              <p>Shipping:</p>
              <p className="text-900">
                {shippingCost ? `$ ${shippingCost}` : "----"}
              </p>
            </div>
            <div className="border-1 px-2 text-100"></div>
            <div className="shipping flex flex-row justify-content-between p-3 text-400">
              <p>Coupon Code:</p>
              <p className="underline font-semibold cursor-pointer text-800" onClick={()=>setCouponVisible(!couponVisible)}>
                Add coupon
              </p>
            </div>
            {
              couponVisible&&
            
            <div className="flex flex-column p-3">
              <p className="text-400 mb-2">Promo/Gift</p>
              {promoCodeSubmitted || couponCode ? (
                <div className="flex flex-row w-full justify-content-between">
                  <p className="text-800 font-bold uppercase font-italic">
                    {couponCode}
                  </p>
                  <i
                    className="pi pi-times cursor-pointer text-red-600 text-lg"
                    size="small"
                    onClick={handleRemovePromoCode}
                  />
                </div>
              ) : (
                <>
                  <div className="flex flex-row w-full justify-content-between">
                    <InputText
                      id="promoCode"
                      name="promoCode"
                      value={promoCode}
                      onChange={handleChange}
                      className="w-full mr-2 uppercase"
                    />
                    <Button
                      label="Apply"
                      outlined
                      className="w-7rem"
                      onClick={handleSubmitPromoCode}
                    />
                  </div>
                  {codeError && (
                    <small className="text-red-500">
                      Please enter a valid code.
                    </small>
                  )}
                  {couponError && (
                    <small className="text-red-500">{couponError}.</small>
                  )}
                </>
              )}
            </div>
}
            <div className="border-1 px-2 text-100"></div>

            <div className=" flex flex-row justify-content-between p-3 text-400">
              <p>Grand total:</p>
              <p className="text-900">${orderTotalPrice()}</p>
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
