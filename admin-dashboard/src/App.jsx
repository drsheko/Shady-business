import "./App.css";
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // fleximport Header from "./components/header";
import './theme/theme-mui.css'
import Header from "./components/header";
import Home from "./components/home";
        
function App() {
  return(
    <div>
     <Home/>
    </div>
  )
}

export default App;
