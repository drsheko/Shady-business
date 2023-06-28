import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { TieredMenu } from "primereact/tieredmenu";

import { PanelMenu } from "primereact/panelmenu";

function Navigation(props) {
  const navigate = useNavigate();
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
      items: [
        {
          label: "All Users",
          icon: "pi pi-users",
        },
        {
          label: "",
        },
      ],
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
      icon: "pi ",
    },
  ];
  return (
    <div className=" min-w-max h-screen overflow-y-scroll hidden lg:block p-1 flipleft  animation-duration-300 animation-ease-out	">
      <div className="max-w-full mt-8 w-20rem">
        <PanelMenu
          model={links}
          className="w-full min-h-screen shadow-0"
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
          }}
        />
      </div>
    </div>
  );
}

export default Navigation;
