import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TieredMenu } from "primereact/tieredmenu";

import { PanelMenu } from "primereact/panelmenu";
import { UserContext } from "../App";
import axios from "axios";
function Navigation(props) {
  const {setUser} = useContext(UserContext)
  const navigate = useNavigate();
  const handleLogout = async () => {
    let url = "http://localhost:3000/api/logout";
    const res = await axios.get(url);
    if (res.data.success) {
      localStorage.removeItem("SHADY_BUSINESS_ADMIN");
      setUser(null);
    }
  };
  const links = [
    {
      label: "Home",
      icon: "pi pi-home ",
      command: () => navigate("/"),
    },
    {
      label: "Coupons",
      command: () => navigate("/coupons"),
    },
    {
      label: "Users",
      icon: "pi pi-users",
      command: () => navigate("/users")
    },
    {
      label: "Products",
      icon: "pi ",
      command: () => navigate("/products"),
    },
    {
      label:'Categories',
      command: () => navigate("/categories")
    },
    {
      label: "Orders",
      command: () => navigate("/orders")
    },
    {
label:"Brands",
command:()=>navigate("/brands")
    },
    {
      label:"Configuration",
      command: () => navigate("/configuration")
    },
    {
      label:"Logout" ,
      command:() => handleLogout()
    }
  ];
  //className=" min-w-max  overflow-y-auto hidden lg:flex relative  p-0 fadeinleft   animation-duration-300 animation-ease-out	border-round-lg shadow-2"
  return (
    <div className="sidebar p-0">
      <div className="max-w-full ">
        <PanelMenu
          model={links}
          className="w-full  shadow-0"
          pt={{
            headerAction: ({ context }) => ({
              className: context.active ? "bg-primary-200" : undefined,
            }),
            headerLabel: {
              className: "font-bold",
            },
            panel: {
              style: { boxShadow: "none" },
            },
            headerIcon: {
              className: "font-bold",
            },
            action: ({ context }) => ({
              className: context.active ? "bg-primary-100" : undefined,
            }),
            menuContent: {
              className: "p-0",
            },
            root:{
              className:"bg-red-50 h-full"
            }
          }}
        />
      </div>
    </div>
  );
}

export default Navigation;
