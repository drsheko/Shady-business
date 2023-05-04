import { Button } from "primereact/button";
import React, { useState, useContext, useEffect } from "react";
import { InputNumber } from "primereact/inputnumber";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

function CartItem(props) {
    const [itemQty, setItemQty]= useState(1);
    const [visible, setVisible] = useState(false);
    useEffect(()=>{
        if(itemQty===0){
          
         setVisible(true)
        }
    },[itemQty])
  return (
    <div className="py-2">
                    

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
            <div className="actions">
            <a href="#" className="mr-2 no-underline"> change</a>
            <a href="#"  className="no-underline" onClick={()=> 
            setVisible(true)
            }> remove </a>
            
            </div>
            
          </div>
        </div>

        <div className="cart-item-price-container p-3 flex flex-column justify-content-between align-items-start sm:flex-row sm:align-items-center lg:col-6">
          <div className="cart-item-price p-1 flex flex-row sm:flex-column">
            <p className="price-title text-lg text-400 lg:hidden align-self-center mr-2">
              {" "}
              Price:
            </p>

            <p className="text-lg">$15.99</p>
          </div>
          <div className=" p-1 flex flex-row sm:flex-column">
            <p className="qty-title text-lg text-400 lg:hidden align-self-center mr-2">
              {" "}
              Quantity:
            </p>
            <InputNumber 
            className="cart-item-qty"
              value={itemQty}
              onValueChange={(e)=>{setItemQty(e.target.value)}}
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
            <p className="total-title text-lg text-400 lg:hidden mr-2"> Total:</p>
            <p className="text-lg">$15.99</p>
          </div>
        </div>
      </div>
      <div className="border-1 text-100"></div>
      <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Are you sure you want to proceed?" 
                header="Confirmation" icon="pi pi-exclamation-triangle" accept={()=>{console.log('yes')}} reject={()=>{console.log('no')}} />
    </div>
  );
}

export default CartItem;
