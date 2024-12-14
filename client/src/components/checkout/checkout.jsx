import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Auth from "./auth";
import Shipping from "./shipping";
import Billing from "./billing";
import Payment from "./payment";
import { Button } from "primereact/button";
import { Steps } from 'primereact/steps';
import { UserContext } from "../../App";
import { useShoppingCart } from "../../contexts/shoppingCartContext";
import OrderSummary from "./orderSummary";

function Checkout(props) {

  const { user } = useContext(UserContext);
  let navigate = useNavigate();
  const {
    shoppingList,
    discountedShoppingList,
    shippingCost,
    shippingAddress,
    shoppingListQty,
    totalTax,
    orderTotalPrice,
    discount,
    coupon,
    shippingMethod,
    resetCart,
  } = useShoppingCart();

  const incrementStep = () => {
    if (active < 4) {
      setActive((state) => state + 1);
    }
  };
  const decrementStep = () => {
    if (active > 0) {
      setActive((state) => state - 1);
    }
  };
  const goToStep = (number) => {
    setActive(number);
  };
  const [active, setActive] = useState(1);
  const [accountState, setAccountState] = useState({
    isActive: true,
    isSubmitted: false,
  });
  const [shippingState, setShippingState] = useState({
    isActive: true,
    isSubmitted: false,
  });
  const [billingState, setBillingState] = useState({
    isActive: true,
    isSubmitted: false,
  });
  const [paymentState, setPaymentState] = useState({
    isActive: true,
    isSubmitted: false,
  });
  const [checkoutData, setCheckoutData] = useState({
    user: user,
    phone: user ? user.phone : null,
    email: user ? user.email : null,
    shippingMethod: null,
    billingSameAddres: true,
    discount: null,
    shipping: {
      address: null,
      method: shippingMethod,
      cost: shippingCost,
    },

    tax: totalTax(),
    total: orderTotalPrice(),
    products: [],
    payment: "",
    couponApplied: null,
    coupons: coupon,
    orderList: [],
  });
  const processPurchasedProducts = () => {
    let products = [];
    if (coupon && discountedShoppingList.length > 0) {
      let _discountedList = [...discountedShoppingList];
      _discountedList.map((product) => {
        let _product = { ...product };
        let purchasePrice =
          typeof _product.discountedPrice === "undefined"
            ? _product.price
            : _product.discountedPrice;
        let mainProduct =
          _product.status === "main" ? _product._id : _product.product._id;
        let optionProduct = _product.status === "option" ? _product._id : null;
        let purchaseProduct = {
          product: mainProduct,
          price: purchasePrice,
          quantity: _product.inCart,
          option: optionProduct,
        };
        products.push(purchaseProduct);
      });
    } else {
      let _list = [...shoppingList];
      _list.map((product) => {
        let _product = { ...product };
        let mainProduct =
          _product.status === "main" ? _product._id : _product.product._id;
        let optionProduct = _product.status === "option" ? _product._id : null;
        let purchaseProduct = {
          product: mainProduct,
          price: _product.price,
          quantity: _product.inCart,
          option: optionProduct,
        };
        products.push(purchaseProduct);
      });
    }
    return products;
  };

  const getActiveStep = () => {
    !accountState.isSubmitted
      ? goToStep(0)
      : !shippingState.isSubmitted
      ? goToStep(1)
      : !billingState.isSubmitted
      ? goToStep(2)
      : !paymentState.isSubmitted
      ? goToStep(3)
      : goToStep(4);
  };
  const submitOrder = async () => {
    try {
      let server = "https://shady-business-server.onrender.com";
      let url = server+"/api/orders/new/order";
      let data = { ...checkoutData, discount };
      function isCyclic(obj) {
        var seenObjects = [];

        function detect(obj) {
          if (obj && typeof obj === "object") {
            if (seenObjects.indexOf(obj) !== -1) {
              return true;
            }
            seenObjects.push(obj);
            for (var key in obj) {
              if (obj.hasOwnProperty(key) && detect(obj[key])) {
                return true;
              }
            }
          }
          return false;
        }

        return detect(obj);
      }
      isCyclic(checkoutData);
      let res = await axios.post(url, checkoutData);
      if (res.data.success && res.data.order) {
        let order = res.data.order;
        navigate("/confirmation", { state: order });
        resetCart();
      }
    } catch (error) {
      navigate("/error");
    }
  };
  useEffect(() => {
    if (shoppingListQty() === 0) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    getActiveStep();
  }, [accountState, shippingState, billingState, paymentState]);
  useEffect(() => {
    let _products = processPurchasedProducts();
    setCheckoutData((state) => ({
      ...state,
      products: [..._products],
      total: orderTotalPrice(),
    }));
  }, [shoppingList, discountedShoppingList]);
  useEffect(() => {
    let _shipping = {
      address: shippingAddress ? shippingAddress._id : null,
      cost: shippingCost,
      method: shippingMethod,
    };
    setCheckoutData((state) => ({
      ...state,
      coupons: coupon,
      shipping: { ..._shipping },
      total: orderTotalPrice(),
    }));
  }, [coupon, shippingMethod, shippingCost, shippingAddress]);
  useEffect(() => {
    setCheckoutData((state) => ({
      ...state,
      discount: discount,
    }));
  }, [discount]);
  useEffect(()=>{
    if(user){
      setActive(2)
    }
  },[])
  const itemRenderer = (item, itemIndex) => {
    const isActiveItem = active === itemIndex;
    const isCheckedItem = active> itemIndex;
    const backgroundColor = isCheckedItem?"green":isActiveItem ? 'var(--primary-color)' : 'var(--surface-b)';
    const textColor = isActiveItem ? 'var(--surface-b)' : 'var(--text-color-secondary)';

    return (
      <div className="flex flex-row">
        <div className="flex flex-column"> 

        
        <span
            className="inline-flex align-items-center justify-content-center align-items-center border-circle  border-1 h-2rem w-2rem z-1 mt-1"
            style={{ backgroundColor: backgroundColor, color: textColor, marginTop: '-25px' }}
            
        >
          {isCheckedItem?<i className="pi pi-check text-white"></i>: isActiveItem?<span className="font-bold text-white p-0"> {itemIndex +1}</span>:<span className="font-bold"> {itemIndex +1}</span>}
          
           
        </span>
        <div className="font-bold text-xs">{item.label}</div>
        </div>
        
        </div>
    );
};

const items = [
    {
        icon: 'pi pi-user',
        label:"Account",
        template: (item) => itemRenderer(item, 0)
    },
    {
        icon: 'pi pi-calendar',
        label:"Shipping",
        template: (item) => itemRenderer(item, 1)
    },
    {
        icon: 'pi pi-check',
        label:"Billing",
        template: (item) => itemRenderer(item, 2)
    },
    {
        icon: 'pi pi-calendar',
        label:"Payment",
        template: (item) => itemRenderer(item, 3)
    },
];
  return (
    <div>
      <p className="font-bold text-2xl text-center mb-3 mt-3">Checkout</p>
      <div className="card shadow-0 h-5rem px-4 sm:px-6 md:px-8">
      <div className="card p-0">
            <Steps model={items} activeIndex={active}  />
        </div>
      
      </div>

      <div className="flex flex-column md:flex-row p-1 sm:p-3 lg:p-5">
        <div className="col-12  md:col-7">
          <Auth
            setAccountState={setAccountState}
            setCheckoutData={setCheckoutData}
          />
          <div className="mx-5 border-1 my-3 border-200"></div>
          <Shipping
            setShippingState={setShippingState}
            shippingState={shippingState}
            setBillingState={setBillingState}
            setCheckoutData={setCheckoutData}
          />
          <div className="mx-5 border-1 my-3 border-200"></div>
          <Billing
            setBillingState={setBillingState}
            billingState={billingState}
            shippingState={shippingState}
            setCheckoutData={setCheckoutData}
            checkoutData={checkoutData}
          />
          <div className="mx-5 border-1 my-3 border-200"></div>
          <Payment
            setPaymentState={setPaymentState}
            paymentState={paymentState}
            checkoutData={checkoutData}
            setCheckoutData={setCheckoutData}
            billingState={billingState}
          />
        </div>
        <div className="col-12  md:col-5 px-0 md:px-2 lg:px-3">
          <OrderSummary />
          <div className="w-100 px-2 lg:px-3 mt-4 mb-3 flex flex-row justify-content-center md:justify-content-end">
            <Button
              label="place order"
              className="w-full bg-primary sm:max-w-25rem shadow-2"
              disabled={active !== 4 || checkoutData.products.length === 0}
              onClick={submitOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
