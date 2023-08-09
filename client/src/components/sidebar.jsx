import React from "react";
import { useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { TieredMenu } from "primereact/tieredmenu";
import { Divider } from "primereact/divider";
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
      <Sidebar visible={props.visible} onHide={() => props.setVisible(false)} pt={{closeButton:{
        className:"bg-primary shadow-3"
      }}}>
        <h2 className="font-bold text-primary text-3xl md:text-5xl">Vaporesta</h2>
        <Divider />
        <TieredMenu
          model={links}
          className="w-full"
          breakpoint="990px"
          pt={{
            label:{
              className:"font-semibold text-800 hover:text-primary"
            },
            submenuIcon:{
              className:"font-semibold text-800 "
            }
          }}
        />
      </Sidebar>
    </div>
  );
}

export default SideNavbar;
