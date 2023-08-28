import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { useShoppingCart } from "../contexts/shoppingCartContext";

function CartItem({ product }) {
  const navigate = useNavigate();
  const [itemQty, setItemQty] = useState(product.inCart);
  const [visible, setVisible] = useState(false);
  const [optionDialog, setOptionDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [option, setOption] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionQuantity, setOptionQuantity] = useState(1);
  const { increaseQty, decreaseQty, removeItem, changeOption, itemTotalPrice } =
    useShoppingCart();

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
  const handleOptionChange = (product) => {
    setOption(product);
    setSelectedProduct(product.product);
    setSelectedOption(product);
    setOptionQuantity(product.inCart);
    setOptionDialog(true);
  };
  const submitOptionChange = () => {
    changeOption(
      option,
      { ...selectedOption, product: selectedProduct, status: "option" },
      optionQuantity
    );
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
              className="mr-2 cursor-pointer"
              onClick={() =>
                navigate(
                  `/product/${
                    product.status === "main"
                      ? product.name
                      : product.product.name
                  }/${
                    product.status === "main"
                      ? product._id
                      : product.product._id
                  }`
                )
              }
            />
          </div>
          <div className="cart-item-info flex flex-column justify-content-center">
            <p className="cart-item-category text-lg text-400 capitalize">
              {product.status === "option"
                ? product.product.category.name
                : product.category.name}
            </p>
            <Link
              to={`/product/${
                product.status === "main" ? product.name : product.product.name
              }/${
                product.status === "main" ? product._id : product.product._id
              }`}
              className="cart-item-name text-xl link no-underline text-900 capitalize hover:underline"
            >
              {product.status === "main" ? product.name : product.product.name}
            </Link>
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
              {product.status === "option" && (
                <Button
                  label="change"
                  className="mr-2 p-0"
                  link
                  size="small"
                  onClick={() => {
                    handleOptionChange(product);
                  }}
                />
              )}

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
        reject={() => {}}
      />
      <Dialog
        visible={optionDialog}
        onHide={() => setOptionDialog(false)}
        draggable={false}
        style={{ minWidth: "70%" }}
        header="Select Option"
      >
        {selectedProduct && selectedOption && (
          <div>
            <p className="capitalize text-800 font-semibold text-center">
              {selectedProduct.name}
            </p>
            <p className="text-800 font-semibold my-2">
              Options <span className="text-red-500">*</span>
            </p>

            <div className="flex flex-column gap-3 p-3">
              {selectedProduct.options.map((option) => {
                return (
                  <div
                    key={option._id}
                    className="flex align-items-center justify-content-between"
                  >
                    <div>
                      <Checkbox
                        inputId={option._id}
                        name="options"
                        value={option}
                        onChange={() => setSelectedOption(option)}
                        checked={option._id === selectedOption._id}
                      />

                      <label htmlFor={option._id} className="ml-2 capitalize">
                        {option.name}
                      </label>
                    </div>
                    <img
                      src={option.photos[0]}
                      alt=""
                      width={50}
                      className="mx-2"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-content-end border-top-1 border-100 pt-3">
              <Button
                label="Cancel"
                size="small"
                icon="pi pi-times"
                onClick={() => setOptionDialog(false)}
                className="p-button-text mr-2"
              />
              <Button
                label="Confirm"
                size="small"
                icon="pi pi-check"
                onClick={() => {
                  submitOptionChange();
                  setOptionDialog(false);
                }}
                autoFocus
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default CartItem;
