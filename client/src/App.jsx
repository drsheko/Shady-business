import { useState, createContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // flex
import "../src/primereact-theme/theme2.css"; // theme
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

export const CartContext = createContext();
export const UserContext = createContext();

function App() {
  const [cart, setCart] = useState();
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
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <CartContext.Provider value={{ cart, setCart }}>
          <Warning />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/" element={<Category />} />
            <Route path="/product/" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </CartContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
