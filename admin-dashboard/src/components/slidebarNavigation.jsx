import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Sidebar } from "primereact/sidebar";
import { TieredMenu } from "primereact/tieredmenu";
import { Divider } from "primereact/divider";
function SlidebarNavigation(props) {
  const navigate = useNavigate();
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
    <div className="lg:hidden absolute">
    <Sidebar visible={props.visible} onHide={() => props.setVisible(false)} className='lg:hidden absolute'>
      <h2>Vaporesta</h2>
      <Divider />
      <TieredMenu model={links} className="w-full" breakpoint="990px" />
    </Sidebar>
    </div>
  );
}

export default SlidebarNavigation;
