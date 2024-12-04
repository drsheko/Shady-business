import { useState, createContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // flex
import "../src/primereact-theme/theme.css"; // theme
//import "primereact/resources/themes/lara-light-teal/theme.css"
import "./App.css";
import Warning from "./components/warning";
import Header from "./components/header";
import Display from "./components/display";
import Search from "./components/search";
import Home from "./components/home";
import CategoryDisplay from "./components/categoryDisplay";
import Category from "./components/category";
import ProductPage from "./components/productPage";
import Cart from "./components/cart";
import Signup from "./components/signupForm";
import SubCategory from "./components/subCategory";
import { ShoppingCartProvider, useShoppingCart } from "./contexts/shoppingCartContext";
import Brands from "./components/brands";
import Coupons from "./components/coupons";
import Checkout from "./components/checkout/checkout";
import Account from "./components/account";
import OrderConfirm from "./components/orderConfirm";
import AgeVerification from "./components/ageVerification";
import Footer from "./components/footer";
import ForgetPassword from "./components/forgetPassword";
import Brand from "./components/brand";
import Addresses from "./components/addresses";
import Orders from "./components/orders";
import ErrorPage from "./components/error"
import AccountSettings from "./components/accountSettings";

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loggedUser = localStorage.getItem("SHADY_BUSINESS_user");
    if (loggedUser === null) {
      setUser(null);
    } else {
      const foundUser = JSON.parse(loggedUser);
      setUser(foundUser);
    }
  }, []);
  return (
    <div className="min-h-screen flex flex-column justify-content-between" >
      <UserContext.Provider value={{ user, setUser }} >
          <ShoppingCartProvider >
          <Header/>
          <AgeVerification />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/" element={<Category />} />
            <Route path="/product/" element={<ProductPage />} />
            <Route path="/:name/:id" element={<SubCategory/>} />
            <Route path="/category/:name/:id" element={<Category/>} />
            <Route path="/product/:name/:id" element={<ProductPage/>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signup" element={<Signup />} />
            <Route path='/brands' element = { <Brands/>} />
            <Route path='/brand/:name/:id' element = { <Brand/>} />
            <Route path='/coupons' element = { <Coupons/>} />
            <Route path="/checkout" element ={<Checkout/>} />
            <Route path="/account" element={<Account/>}>
              <Route index  element ={<AccountSettings/>} />
              <Route path="orders"  element ={<Orders/>} />
              <Route path="addresses"  element ={<Addresses/>} />
              <Route path="settings"  element ={<AccountSettings/>} />
            </Route>

            <Route path="/confirmation" element={<OrderConfirm/>}/>
            <Route path="/forgetpassword" element={<ForgetPassword/>} />
            <Route path="/error" element={<ErrorPage/>}/>
          </Routes>
          
          <Footer />
          </ShoppingCartProvider>
        
      </UserContext.Provider>
    </div>
  );
}

export default App;
