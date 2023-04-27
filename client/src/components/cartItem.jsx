import { Button } from "primereact/button";
import React, { useState, useContext } from "react";
import { InputNumber } from "primereact/inputnumber";

function CartItem(props) {
    return (
        <div>
           <div className="cart-item flex flex-column justify-content-between lg:flex-row">
          <div className="cart-item-information flex flex-row lg:col-6">
            <div className="cart-item-figure">
              <img
                src="../src/assets/vape/vape1.avif"
                alt=""
                width="100px"
                height={"100px"}
              />
            </div>
            <div className="cart-item-info flex flex-column justify-content-between">
              <p className="cart-item-category text-lg text-400">POD POCKET</p>
              <p className="cart-item-name text-xl link">
                Pod Pocket Disposable (7500 Puffs)
              </p>
              <div className="option">
                <p className="text-400 uppercase">
                  Option: <span className="text-color">red</span>
                </p>
              </div>
              <a href=""> change</a>
            </div>
          </div>

          <div className="cart-item-price-container p-3 flex flex-column justify-content-between align-items-start sm:flex-row sm:align-items-center lg:col-6">
            <div className="cart-item-price p-1 flex flex-row sm:flex-column">
              <p className="price-title text-lg text-400 lg:hidden align-self-center">
                {" "}
                Price:
              </p>

              <p className="text-lg">$15.99</p>
            </div>
            <div className="cart-item-qty p-1 flex flex-row sm:flex-column">
              <p className="qty-title text-lg text-400 lg:hidden align-self-center">
                {" "}
                Quantity:
              </p>
              <InputNumber
                value={1}
                showButtons
                buttonLayout="horizontal"
                step={1}
                min={0}
                decrementButtonClassName="p-button-primary p-button-outlined "
                incrementButtonClassName="p-button-primary p-button-outlined"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
              />
            </div>
            <div className="cart-item-total p-1 flex flex-row sm:flex-column">
              <p className="total-title text-lg text-400 lg:hidden"> Total:</p>
              <p className="text-lg">$15.99</p>
            </div>
          </div>
        </div> 
        </div>
    );
}

export default CartItem;