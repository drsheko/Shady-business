import "./App.css";
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // fleximport Header from "./components/header";
import "./theme/theme-mui.css";
import { createContext, useState, useEffect } from "react";
import Home from "./components/home";
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loggedAdmin = localStorage.getItem("SHADY_BUSINESS_ADMIN");
    if (loggedAdmin === null) {
      setUser(null);
    } else {
      const foundUser = JSON.parse(loggedAdmin);
      setUser(foundUser);
    }
  }, []);
 
  return (
    <div className="h-full w-full">
      <UserContext.Provider value={{ user, setUser }}>
        <Home />
      </UserContext.Provider>
    </div>
  );
}

export default App;
