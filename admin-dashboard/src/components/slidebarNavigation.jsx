import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Sidebar } from "primereact/sidebar";
import { TieredMenu } from "primereact/tieredmenu";
import { Divider } from "primereact/divider";
import { PanelMenu } from "primereact/panelmenu";

import Navigation from "./navigation";
function SlidebarNavigation(props) {
  const navigate = useNavigate();
  const links1 = [
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
      command: () => navigate("/users"),
    },
    {
      label: "Products",
      icon: "pi ",
      command: () => navigate("/products"),
    },
    {
      label: "Categories",
      command: () => navigate("/categories"),
    },
    {
      label: "Orders",
      command: () => navigate("/orders"),
    },
    {
      label: "Brands",
      command: () => navigate("/brands"),
    },
    {
      label: "Configuration",
      command: () => navigate("/configuration"),
    },
    {
      label: "Logout",
      command: () => handleLogout(),
    },
  ];
  const links = [
    {
      label: "Home",
      icon: "pi pi-home ",
      command: () => {
        props.setVisible(false);
        navigate("/");
      },
    },
    {
      label: "Coupons",
      items: [
        {
          label: "All Coupons",
          command: () => {
            props.setVisible(false);
            navigate("/coupons");
          },
        },
        {
          label: "Create coupon",
          icon: "pi pi-plus",
        },
      ],
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
    },
    {
      label: "Orders",
      icon: "pi ",
    },
  ];
  return (
    <div className="lg:hidden absolute px-0">
      <Sidebar
        visible={props.visible}
        onHide={() => props.setVisible(false)}
        className="lg:hidden absolute"
        pt={{  closeButton: {
          className: "border-1 text-primary shadow-3",
        },content:{
          className: "p-0"
        },headerLabel:{
          className:'uppercase'
        }
}}
      >
         <h2 className="font-bold text-primary text-3xl md:text-5xl text-center">
          Vaporesta
        </h2>
        <Divider />

        <PanelMenu
          model={links1}
          className="w-full  shadow-0"
          pt={{
            root:{
style:{height:"5rem !important"},className:"overflow-hidden	"
            },
            headerAction: ({ context }) => ({
              className: context.active ? "bg-primary-200" : undefined,
            }),
            headerLabel: {
              className: "font-bold",
            },
            panel: {
              style: { boxShadow: "none", height:"5rem !important" }
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
            root: {
              className: "bg-red-50 ",
            },
          }}
        />
      </Sidebar>
    </div>
  );
}

export default SlidebarNavigation;
