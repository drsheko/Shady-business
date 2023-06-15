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
      <Sidebar visible={props.visible} onHide={() => props.setVisible(false)}>
        <h2>Vaporesta</h2>
        <Divider />
        <TieredMenu
          model={links}
          className="w-full"
          breakpoint="990px"
        />
      </Sidebar>
    </div>
  );
}

export default SideNavbar;
