import axios from "axios";
import React, { useState, createContext, useContext, useEffect } from "react";
import AddToCartDialog from "../components/addToCartDialog";
import { checkCouponByCode, applyCoupon } from "../contexts/couponFunctions";
const ShoppingCartContext = createContext({});

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }) {
  const [shoppingList, setShoppingList] = useState([]);
  const [discountedShoppingList, setDiscountedShoppingList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [shippingCost, setShippingCost] = useState(null);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [amountOff, setAmountOff] = useState(0);
  const [discount, setDiscount] = useState(null);
  const [addedQty, setAddedQty] = useState(1);
  const [couponCode, setCouponCode] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

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
      setAddedProduct(product);
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
    return Number(total.toFixed(2));
  };

  const cartTotalPriceAfterDiscount = () => {
    let total = 0;
    discountedShoppingList.map((product) => {
      if (typeof product.discountedPrice !== "undefined") {
        let substotal = product.inCart * product.discountedPrice;
        total += substotal;
      } else {
        let substotal = product.inCart * product.price;
        total += substotal;
      }
    });
    return Number(total.toFixed(2));
  };
  const totalTax = () => {
    let total = coupon ? cartTotalPriceAfterDiscount() : cartTotalPrice();
    let tax = total * 0.09;
    return Number(tax.toFixed(2));
  };

  const orderTotalPriceWithoutTax = () => {
    let total = coupon ? cartTotalPriceAfterDiscount() : cartTotalPrice();
    let shipping = shippingCost ? Number(shippingCost) : 0;
    let all = total + shipping - amountOff;
    return Number(all.toFixed(2));
  };
  const orderTotalPrice = () => {
    let total = coupon ? cartTotalPriceAfterDiscount() : cartTotalPrice();
    let tax = totalTax();
    let shipping = shippingCost ? Number(shippingCost) : 0;
    let all = total + tax + shipping - amountOff;
    return Number(all.toFixed(2));
  };

  const clipCoupon = async (code) => {
    setCouponError(null);
    setCoupon(null);
    setDiscount(0);
    try {
      let res = await checkCouponByCode(code, cartTotalPrice);
      if (!res.success) {
        setCouponError(res.error);
        setCoupon(null);
        return;
      }
      if (res.success) {
        setCouponError(null);
        setCoupon(res.coupon);
      }
    } catch (error) {
      console.log("clip error", error);
    }
  };
  const updateDiscount = () => {
    let off = cartTotalPrice() - cartTotalPriceAfterDiscount();
    console.log(cartTotalPriceAfterDiscount());
    if (off > 0) {
      setDiscount(Number(off.toFixed(2)));
    }
  };
  const applyClippedCoupon = () => {
    applyCoupon(
      coupon,
      shoppingList,
      setDiscountedShoppingList,
      cartTotalPrice,
      setShippingCost,
      setShippingMethod,
      setAmountOff
    );
  };

  const unClipCoupon = () => {
    let _list = [...shoppingList];
    _list.map((product) => {
      if (typeof product.discountedPrice !== "undefined")
        delete product.discountedPrice;
    });
    setShoppingList(_list);
    setCouponError(null);
    setCoupon(null);
    setCouponCode(null);
    setAmountOff(0);
    setDiscount(null);
  };

  const resetCart = () => {
    setShoppingList([]);
    setDiscountedShoppingList([]);
    setDiscount(null);
    setCoupon(null);
    setCouponCode(null);
    setShippingCost(null);
    setShippingMethod(null);
    setShippingAddress(null);
    setAmountOff(0);
  };
  useEffect(() => {
    if (discountedShoppingList.length > 0) {
      updateDiscount();
    }
  }, [discountedShoppingList]);
  useEffect(() => {
    if (couponCode) {
      clipCoupon(couponCode);
    }
    if (coupon) {
      applyClippedCoupon();
    }
  }, [shoppingList]);

  useEffect(() => {
    if (coupon) {
      applyClippedCoupon();
    }
  }, [coupon]);
  useEffect(() => {
    if (amountOff > 0) {
      setDiscount(amountOff);
    } else {
      setDiscount(null);
    }
  }, [amountOff]);
  useEffect(() => {
    console.log(shippingCost);
  }, [shippingCost, shippingMethod]);
  return (
    <ShoppingCartContext.Provider
      value={{
        shoppingList,
        discountedShoppingList,
        setDiscountedShoppingList,
        getItemQty,
        increaseQty,
        decreaseQty,
        removeItem,
        shippingMethod,
        shippingCost,
        shippingAddress,
        setShippingAddress,
        setShippingCost,
        setShippingMethod,
        shoppingListQty,
        itemTotalPrice,
        cartTotalPrice,
        cartTotalPriceAfterDiscount,
        totalTax,
        orderTotalPrice,
        couponError,
        coupon,
        setCouponError,
        discount,
        couponCode,
        setCouponCode,
        clipCoupon,
        unClipCoupon,
        resetCart,
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
