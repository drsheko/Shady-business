import axios from "axios";
import React, { useState, createContext, useContext, useEffect } from "react";
import { Message } from "primereact/message";
import AddToCartDialog from "../components/addToCartDialog";
const ShoppingCartContext = createContext({});

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }) {
  const [shoppingList, setShoppingList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [addedQty, setAddedQty] = useState(1);
  const getItemQty = (product) => {
    return shoppingList.find((item) => item._id === product._id)?.inCart || 0;
  };

  const increaseQty = (product, qty = 1, alert = true) => {
    setAddedQty(qty);

    let found = shoppingList.find((item) => item._id === product._id);
    if (found) {
      setShoppingList((currItems) => {
        return currItems.map((item) => {
          if (item._id === product._id) {
            item.inCart += qty;
            return item;
          } else {
            return item;
          }
        });
      });
    } else {
      //  determine its main product or option
      if (product.selectedOption) {
        let temp = product.selectedOption;
        temp.product = product;
        temp.status = "option";
        product = temp;
        setAddedProduct(product);
      } else {
        product.status = "main";
        setAddedProduct(product);
      }
      product.inCart = qty;
      setShoppingList((currItems) => [...currItems, product]);
    }
    setVisible(alert);
  };
  const decreaseQty = (product, qty = 1) => {
    let found = shoppingList.find((item) => item._id === product._id);
    if (!found) {
      return;
    } else {
      if (found.inCart - qty === 0) {
        removeItem(product);
      } else {
        setShoppingList((currItems) => {
          return currItems.map((item) => {
            if (item._id === product._id) {
              item.inCart -= qty;
              return item;
            } else {
              return item;
            }
          });
        });
      }
    }
  };

  const removeItem = (product) => {
    setShoppingList((currItems) => {
      return currItems.filter((item) => item._id !== product._id);
    });
  };

  const itemTotalPrice = (product) => {
    let qty = getItemQty(product);
    let total = qty * product.price;
    return total;
  };
  const shoppingListQty = () => {
    let total = shoppingList
      ? shoppingList.reduce((qty, item) => qty + item.inCart, 0)
      : 0;
    return total;
  };

  const cartTotalPrice = () => {
    let total = shoppingList.reduce(
      (acc, val) => acc + val.inCart * val.price,
      0
    );
    return total;
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        shoppingList,
        getItemQty,
        increaseQty,
        decreaseQty,
        removeItem,
        shoppingListQty,
        itemTotalPrice,
        cartTotalPrice,
      }}
    >
      <AddToCartDialog
        visible={visible}
        setVisible={setVisible}
        product={addedProduct}
        qty={addedQty}
        shoppingListQty={shoppingListQty}
      />
      {children}
    </ShoppingCartContext.Provider>
  );
}
