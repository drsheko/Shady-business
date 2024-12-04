import React from "react";
import { Menubar } from "primereact/menubar";
import useNavigationlinks from "./useNavigationLinks";
function NavLinks(props) {
  const { links } = useNavigationlinks();

  return (
    <div className="card">
      <Menubar model={links} breakpoint="360px" 
    />
    </div>
  );
}

export default NavLinks;
