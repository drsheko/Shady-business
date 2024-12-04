import React from "react";
import { useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { TieredMenu } from "primereact/tieredmenu";
import { Divider } from "primereact/divider";
import { PanelMenu } from "primereact/panelmenu";

import useNavigationlinks from "./useNavigationLinks";

function SideNavbar(props) {
  const { links, linkClicked, setLinkClicked } = useNavigationlinks();

  useEffect(() => {
    if (linkClicked) {
      props.setVisible(false);
      setLinkClicked(false);
    }
  }, [linkClicked]);

  return (
    <div>
      <Sidebar
        visible={props.visible}
        onHide={() => props.setVisible(false)}
        pt={{
          closeButton: {
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
          model={links}
          className="w-full  shadow-0"
          pt={{
            root: {
              style: { height: "5rem !important" },
              className: "overflow-hidden	",
            },
            headerAction: ({ context }) => ({
              className: context.active ? "bg-primary-200" : undefined,
            }),
            headerLabel: {
              className: "font-bold",
            },
            panel: {
              style: { boxShadow: "none", height: "5rem !important" },
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
              className: "bg-red-50 h-full",
            },
            expandIcon: "absolute bottom-0 right-0",
          }}
        />
      </Sidebar>
    </div>
  );
}

export default SideNavbar;
