import { Button } from "primereact/button";
import React, { useState, useEffect } from "react";
import { InputNumber } from "primereact/inputnumber";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useShoppingCart } from "../contexts/shoppingCartContext";

function CartItem({ product }) {
  const [itemQty, setItemQty] = useState(product.inCart);
  const [visible, setVisible] = useState(false);
  const {
    shoppingList,
    getItemQty,
    increaseQty,
    decreaseQty,
    removeItem,
    itemTotalPrice,
    shoppingListQty,
  } = useShoppingCart();

  const handleQtyChange = () => {
    if (product.inCart === itemQty) {
      return;
    }
    if (itemQty > product.inCart) {
      let added = itemQty - product.inCart;

      increaseQty(product, added, false);
    } else {
      let removed = product.inCart - itemQty;
      decreaseQty(product, removed);
    }
  };

  useEffect(() => {
    handleQtyChange();
    if (itemQty === 0) {
      setVisible(true);
    }
  }, [itemQty]);
  return (
    <div className="py-2">
      <div className="cart-item flex flex-column justify-content-between lg:flex-row">
        <div className="cart-item-information flex flex-row lg:col-6">
          <div className="cart-item-figure">
            <img
              src={product.photos[0]}
              alt=""
              width="100px"
              height={"100px"}
              className="mr-2"
            />
          </div>
          <div className="cart-item-info flex flex-column justify-content-center">
            <p className="cart-item-category text-lg text-400 capitalize">
              {product.status === "option"
                ? product.product.category.name
                : product.category.name}
            </p>
            <p className="cart-item-name text-xl link">
              {product.status === "main" ? product.name : product.product.name}
            </p>
            {product.status === "option" ? (
              <div className="option">
                <p className="text-400 uppercase">
                  Option: <span className="text-color">{product.name}</span>
                </p>
              </div>
            ) : (
              ""
            )}

            <div className="actions">
              <Button label="change" className="mr-2 p-0" link size="small" />

              <Button
                label="remove"
                className="no-underline p-0"
                link
                size="small"
                onClick={() => setVisible(true)}
              />
            </div>
          </div>
        </div>

        <div className="cart-item-price-container p-3 flex flex-column justify-content-between align-items-start sm:flex-row sm:align-items-center lg:col-6">
          <div className="cart-item-price p-1 flex flex-row sm:flex-column">
            <p className="price-title text-lg text-400 lg:hidden align-self-center mr-2">
              {" "}
              Price
            </p>

            {typeof product.discountedPrice === "undefined" ? (
              <p className="text-lg">$ {product.price}</p>
            ) : (
              <div className="flex flex-row">
                <p className="line-through text-300 font-medium text-lg">
                  $ {product.price}
                </p>
                <p className="text-green-500 font-semibold text-lg ml-2 ">
                  $ {product.discountedPrice}
                </p>
              </div>
            )}
          </div>
          <div className=" p-1 flex flex-row sm:flex-column">
            <p className="qty-title text-lg text-400 lg:hidden align-self-center mr-2">
              {" "}
              Quantity
            </p>
            <InputNumber
              className="cart-item-qty"
              value={itemQty}
              onValueChange={(e) => setItemQty(e.value)}
              onChange={(e) => setItemQty(e.value)}
              showButtons
              buttonLayout="horizontal"
              step={1}
              min={1}
              decrementButtonClassName="p-button-primary p-button-outlined "
              incrementButtonClassName="p-button-primary p-button-outlined"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              allowEmpty={false}
              required
            />
          </div>
          <div className="cart-item-total p-1 flex flex-row sm:flex-column">
            <p className="total-title text-lg text-400 lg:hidden mr-2">
              {" "}
              Total
            </p>
            <p className="text-lg">${itemTotalPrice(product).toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="border-1 text-100"></div>
      <ConfirmDialog
        visible={visible}
        draggable={false}
        onHide={() => setVisible(false)}
        message="Are you sure you want to proceed?"
        header={`Remove ${
          product.status === "option" ? product.product.name : product.name
        }`}
        icon="pi pi-times text-red-500"
        rejectLabel="cancel"
        acceptLabel="remove"
        accept={() => {
          removeItem(product);
        }}
        reject={() => {
        }}
      />
    </div>
  );
}

export default CartItem;
