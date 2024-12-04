import axios from "axios";

/* Wrapper Function to check coupon by code
  and set coupon or set error 
  takes ( 2 )parameters:
  1- coupon code
  2- shopping List total price
  */
export const checkCouponByCode = async (code, orderTotal) => {
  try {
    let res = await getCouponByCode(code);
    if (res.success) {
      var coupon = await res.coupon[0];
      if (!isCouponValid(coupon)) {
        return { success: false, error: "coupon is expired" };
      } else if (!isCouponApplicable(coupon, orderTotal)) {
        return {
          success: false,
          error: "your order amount does not qualify this coupon",
        };
      } else {
        return { success: true, coupon };
      }
    }
  } catch (error) {
    return { success: false, error: "Invalid code" };
  }
};

/* Wrapper Function to apply coupon based on its type
    takes  7 parameters :-
    1- coupon 
    2- ShoppingList
    3- setState(discountedShoppingList)
    4- shopping list total price
    5- setState( Shipping cost)
    6- setState(shipping Method)
    7- setState( aomuntOff)
  */
export const applyCoupon = (
  coupon,
  shoppingList,
  setDiscountedShoppingList,
  orderTotal,
  setShippingCost,
  setShippingMethod,
  setAmountOff
) => {
  let type = getCouponType(coupon);
  switch (type) {
    case "percentage off":
      applyPercentageOffCoupon(coupon, shoppingList, setDiscountedShoppingList);
      break;
    case "amount off":
      applyAmountOffCoupon(
        coupon,
        shoppingList,
        setDiscountedShoppingList,
        orderTotal,
        setAmountOff
      );
      break;
    case "BOGO":
      applyBOGOCoupon(coupon, shoppingList, setDiscountedShoppingList);
      break;
    case "free gift":
      applyFreeGiftCoupon(coupon, shoppingList, setDiscountedShoppingList);
      break;
    default:
      applyFreeShippingCoupon(setShippingCost, setShippingMethod);
  }
};
const getCouponByCode = async (code) => {
  let data = {
    code: code,
  };
  try {
    let url = "http://localhost:3000/api/coupons/code/coupon";
    let res = await axios.post(url, data);
    if (res.data.success && res.data.coupon) {
      return { success: true, coupon: res.data.coupon };
    }
  } catch (error) {
    return { success: error, error: "invalid code" };
  }
};

const isCouponValid = (coupon) => {
  let today = new Date();
  let expire = new Date(coupon.expireDate);
  return expire > today;
};

const isCouponApplicable = (coupon, orderTotal) => {
  if (coupon.minimumPurchase > 0 && coupon.minimumPurchase > orderTotal()) {
    return false;
  }
  if (coupon.maximumPurchase > 0 && coupon.maximumPurchase < orderTotal()) {
    return false;
  }
  return true;
};

const getCouponType = (coupon) => {
  return coupon.type;
};
// takes 2 parameters (a, b) a=set shipping cost to 0, b =set shipping method to "free"
const applyFreeShippingCoupon = (setShippingCost, setShippingMethod) => {
  setShippingCost(0);
  setShippingMethod("free");
};

/*
  takes 3 parameters :
  1- coupon
  2- shopping list
  3- setState(discounted shoppping list)
   */
const applyPercentageOffCoupon = (
  coupon,
  shopList,
  setDiscountedShoppingList
) => {
  let percent = coupon.percentageOff;
  // apply discount on all products of order
  if (coupon.products.length === 0) {
    let _list = [...shopList];
    let updatedList = [];
    _list.map((product) => {
      let _price = Math.floor(product.price * ((100 - percent) / 100));
      let _product = { ...product };
      _product.discountedPrice = _price;
      updatedList.push(_product);
    });
    setDiscountedShoppingList(updatedList);
  } else {
    // apply discount percentage on certain products
    let discountedProducts = [...coupon.products];
    let discountedProductsIds = discountedProducts.map((product) => {
      return product._id;
    });
    let _list = [...shopList];
    let updatedList = [];
    _list.map((product) => {
      if (
        (product.status === "main" &&
          discountedProductsIds.includes(product._id)) ||
        (product.status === "option" &&
          discountedProductsIds.includes(product.product._id))
      ) {
        let _price = Math.floor(product.price * ((100 - percent) / 100));
        let _product = { ...product };
        _product.discountedPrice = _price;
        updatedList.push(_product);
      } else {
        updatedList.push(product);
      }
    });
    setDiscountedShoppingList(updatedList);
  }
};
const applyAmountOffCoupon = (
  coupon,
  shopList,
  setDiscountedShoppingList,
  orderTotal,
  setAmountOff
) => {
  let amount = coupon.amountOff;
  // apply discount on order
  if (coupon.products.length === 0) {
    setAmountOff(amount);
    setDiscountedShoppingList(shopList);
  } else {
    // apply discount on certain products
    let discountedProducts = [...coupon.products];
    let discountedProductsIds = discountedProducts.map((product) => {
      return product._id;
    });
    let _list = [...shopList];
    let updatedList = [];
    _list.map((product) => {
      if (
        (product.status === "main" &&
          discountedProductsIds.includes(product._id)) ||
        (product.status === "option" &&
          discountedProductsIds.includes(product.product._id))
      ) {
        let _price = product.price - amount;
        let _product = { ...product };
        _product.discountedPrice = _price;
        updatedList.push(_product);
      } else {
        updatedList.push(product);
      }
    });
    setDiscountedShoppingList(updatedList);
  }
};

const applyBOGOCoupon = (coupon, shopList, setDiscountedShoppingList) => {
  let discountedProducts = [...coupon.products];
  let discountedProductsIds = discountedProducts.map((product) => {
    return product._id;
  });
  let _list = [...shopList];
  let updatedList = [];
  _list.map((product) => {
    if (
      // find if product discounted or not
      (product.status === "main" &&
        discountedProductsIds.includes(product._id)) ||
      (product.status === "option" &&
        discountedProductsIds.includes(product.product._id))
    ) {
      if (product.inCart > 1) {
        let paidCount = Math.ceil(product.inCart / 2);
        let freeCount = Math.floor(product.inCart / 2);
        let paidProduct = { ...product };
        paidProduct.inCart = paidCount;
        updatedList.push(paidProduct);
        let freeProduct = { ...product };
        freeProduct.inCart = freeCount;
        freeProduct.discountedPrice = 0;
        updatedList.push(freeProduct);
      } else {
        updatedList.push(product);
      }
    } else {
      updatedList.push(product);
    }
  });
  setDiscountedShoppingList(updatedList);
};

const applyFreeGiftCoupon = (coupon, shopList, setDiscountedShoppingList) => {
  let gift = coupon.freeGift;
  let giftCount = coupon.giftCount;
  let freeGiftCount;
  let productCount = 1;
  let dealProducts = coupon.products;
  let dealProductsIds = dealProducts.map((product) => {
    return product._id;
  });
  let _list = [...shopList];
  let updatedList = [];
  _list.map((product) => {
    if (
      (product.status === "main" && dealProductsIds.includes(product._id)) ||
      (product.status === "option" &&
        dealProductsIds.includes(product.product._id))
    ) {
      if (product.inCart >= productCount) {
        freeGiftCount = Math.floor(product.inCart / productCount) * giftCount;
      }
    }
  });
  _list.map((product) => {
    if (
      (product.status === "main" && product._id === gift._id) ||
      (product.status === "option" && product._id === gift._id)
    ) {
      if (product.inCart <= freeGiftCount) {
        let _product = { ...product };
        _product.discountedPrice = 0;
        updatedList.push(_product);
      } else {
        let paidProductCount = product.inCart - freeGiftCount;
        let _paidProduct = { ...product };
        delete _paidProduct.discountedPrice;
        _paidProduct.inCart = paidProductCount;
        updatedList.push(_paidProduct);
        let _freeProduct = { ...product };
        _freeProduct.inCart = freeGiftCount;
        _freeProduct.discountedPrice = 0;
        updatedList.push(_freeProduct);
      }
    } else {
      updatedList.push(product);
    }
  });
  setDiscountedShoppingList(updatedList);
};
