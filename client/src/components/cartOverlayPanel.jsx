import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { useShoppingCart } from "../contexts/shoppingCartContext";

function CartOverlay(props) {
  const [visible, setVisible] = useState(false);
  const {
    shoppingList,
    discountedShoppingList,
    coupon,
    shoppingListQty,
    orderTotalPrice,
    totalTax,
  } = useShoppingCart();
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

  return (
    <div>
      <div className="w-max h-max p-0 m-0 relative">
        <Button
          icon="pi pi-shopping-bag font-bold"
          size="small"
          className="header-button hover:bg-primary"
          text
          raised
          onClick={() => setVisible(!visible)}
        />
        {shoppingListQty() > 0 && (
          <div
            className="text-white bg-green-500 font-bold border-circle text-center p-1 absolute"
            style={{
              width: "26px",
              height: "26px",
              right: "-5px",
              top: "-10px",
            }}
          >
            {shoppingListQty()}
          </div>
        )}
      </div>

      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        position="right"
        style={{ width: "400px" }}
        pt={{
          header: {
            className: "p-0 max-h-0	 ",
          },
          closeButton: {
            className: "surface-50 shadow-3 ",
            style: { position: "absolute", left: "25px", top: "20px" },
          },
          closeIcon: {
            className: "text-primary",
          },
          content: {
            className: "h-100 flex flex-column p-0",
          },
        }}
      >
        <div className="p-4 mb-3 surface-50">
          <p className="text-primary text-center font-bold text-xl ">Cart</p>
        </div>
        <div className="card ss overflow-y-auto px-1" style={{ flex: "1" }}>
          <div className="content h-full">
            {shoppingList.length === 0 ? (
              <div className="mt-6 text-center">
                <p className="text-500 font-semibold text-lg sm:text-xl">
                  Your Cart Is Empty
                </p>
              </div>
            ) : (
              <div className="card h-full flex flex-column justify-content-between">
                <div style={{ flex: "1" }}>
                  {coupon && discountedShoppingList.length > 0 ? (
                    <div className="overflow-y-auto px-2	max-h-16rem	">
                      <p className="text-600 ml-3">
                        {shoppingListQty()} item(s)
                      </p>
                      {discountedShoppingList.map((item) => {
                        return cartItem(item);
                      })}
                    </div>
                  ) : (
                    <div className="overflow-y-auto px-2		" style={{ flex: "1" }}>
                      <p className="text-600 ml-3">
                        {shoppingListQty()} item(s)
                      </p>
                      {shoppingList.map((item) => {
                        return cartItem(item);
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {shoppingList.length > 0 && (
          <div>
            <div className="flex flex-row justify-content-between align-items-center w-full  border-y-1	 border-100 p-4 mt-auto ">
              <p className="text-800 text-lg">Total(USD)</p>
              <p className="text-800 font-semibold text-3xl">
                ${(orderTotalPrice() - totalTax()).toFixed(2)
                }
              </p>
            </div>
            <div className="p-3 flex justify-content-end min-h-content surface-50">
              <Link
                to="/checkout"
                className="p-button p-component no-underline font-semibold mx-2"
                onClick={() => setVisible(false)}
              >
                Check out
              </Link>
              <Link
                to="/cart"
                className="p-button p-component no-underline font-semibold"
                onClick={() => setVisible(false)}
              >
                view cart
              </Link>
            </div>
          </div>
        )}
      </Sidebar>
    </div>
  );
}

export default CartOverlay;
