import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Menubar } from "primereact/menubar";
import useNavigationlinks from "./useNavigationLinks";
import SideNavbar from "./sidebar";
import CartOverlay from "./cartOverlayPanel";
import SignInSidebar from "./sign-in-sidebar";
import Warning from "./warning";
import Search from "./search";
import { Button } from "primereact/button";
function Header(props) {
  const toast = useRef(null);
  const { links } = useNavigationlinks();
  const [visible, setVisible] = useState(false);
  const [visibleSearch, setVisibleSearch] = useState(false);
  const [signInVisible, setSignInVisible] = useState(false);
  return (
    <div className="sticky top-0 z-5  shadow-3">
      <Toast ref={toast} />
      <Warning />
      
      <div className=" card flex justify-content-between align-items-center bg-primary-reverse ">
      <div className="sm:hidden flex justify-content-between align-items-center text-base py-3 ml-1">
      <Button
            icon="pi pi-align-justify font-bold"
            size="small"
            text
            raised
            className="header-button lg:hidden hover:bg-primary"
            onClick={() => {
              setVisible((prevState) => !prevState);
            }}
          />
           <Button
            icon="pi pi-search font-bold"
            size="small"
            text
            raised
            className="header-button mx-2 hover:bg-primary"
            onClick={() => setVisibleSearch((state) => !state)}
          />
      </div>
        <p className=" font-bold text-3xl md:text-5xl mx-3 align-self-center">
          <Link to="/" className="no-underline text-primary">
            Vaporesta
          </Link>
        </p>
        <div className="hidden lg:block ">
            <div className="card">
                <Menubar model={links} breakpoint="360px" 
              />
              </div>
        </div>

        <div className="card  flex justify-content-between align-items-center text-base py-3 sm:py-4 mr-1 sm:mr-4">
          <Button
            icon="pi pi-search font-bold"
            size="small"
            text
            raised
            className="mx-2 hover:bg-primary hidden sm:flex"
            onClick={() => setVisibleSearch((state) => !state)}
          />
          <CartOverlay />
          <Button
            icon="pi pi-user font-bold"
            size="small"
            text
            raised
            className="header-button mx-2 hover:bg-primary"
            onClick={() => setSignInVisible((state) => !state)}
          />
          <Button
            icon="pi pi-align-justify font-bold"
            size="small"
            text
            raised
            className="hidden sm:flex lg:hidden hover:bg-primary"
            onClick={() => {
              setVisible((prevState) => !prevState);
            }}
          />
        </div>
      </div>
      <div>
        <SideNavbar visible={visible} setVisible={setVisible} />
        <SignInSidebar
          signInVisible={signInVisible}
          setSignInVisible={setSignInVisible}
          toast={toast}
        />
        {visibleSearch && <Search setVisibleSearch={setVisibleSearch} />}
      </div>
    </div>
  );
}

export default Header;
