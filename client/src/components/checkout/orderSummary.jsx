import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../../contexts/shoppingCartContext";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

function OrderSummary(props) {
  let navigate = useNavigate();
  const {
    shoppingList,
    discountedShoppingList,
    shippingCost,
    shoppingListQty,
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
            {typeof item.discountedPrice === "undefined" ? (
              <p className="text-800 align-self-end">${item.price}</p>
            ) : (
              <div className="flex flex-column">
                <p className="line-through text-300 font-medium">
                  $ {item.price}
                </p>
                <p className="text-green-500 font-semibold align-self-end">
                  $ {item.discountedPrice}
                </p>
              </div>
            )}
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
        {discount ? (
          <>
            <div className="flex flex-row justify-content-between w-full my-2">
              <p className="text-red-500">Discount</p>
              <p className="text-red-500">$ -{discount}</p>
            </div>
            <div className="flex flex-row justify-content-between w-full my-2">
              <p className="text-800">After discount</p>
              <p className="text-800">$ {cartTotalPriceAfterDiscount()}</p>
            </div>
          </>
        ) : (
          ""
        )}
        <div className="flex flex-row justify-content-between w-full my-2">
          <p className="text-800">Shipping</p>
          <p className="text-800">
            {" "}
            {shippingCost !== null ? `$ ${shippingCost}` : "______"}
          </p>
        </div>
        <div className="flex flex-row justify-content-between w-full my-2">
          <p className="text-800">Tax</p>
          <p className="text-800">$ {totalTax()}</p>
        </div>
        <div className="flex flex-column my-2">
          <p className="text-800 mb-2">Promo/Gift</p>
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
      </div>
      <div className="flex flex-row justify-content-between align-items-center w-full my-2 border-top-1 border-200 p-4">
        <p className="text-800 text-lg">Total(USD)</p>
        <p className="text-800 font-bold text-3xl">${orderTotalPrice()}</p>
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
        {coupon && discountedShoppingList.length > 0 ? (
          <div className="overflow-y-auto px-2	max-h-16rem	">
            <p className="text-600 ml-3">{shoppingListQty()} item(s)</p>
            {discountedShoppingList.map((item) => {
              return cartItem(item);
            })}
          </div>
        ) : shoppingList.length > 0 ? (
          <div className="overflow-y-auto px-2	max-h-16rem	">
            <p className="text-600 ml-3">{shoppingListQty()} item(s)</p>
            {shoppingList.map((item) => {
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
