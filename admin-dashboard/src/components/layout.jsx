import React, { useState, useEffect, useRef } from "react";
import Content from "./content";
import Header from "./header";
import Navigation from "./navigation";
import SlidebarNavigation from "./slidebarNavigation";
import useWidth from "../tools/useWidth";
import Sidebar from "./sidebar";
function Layout(props) {
  const width = useWidth();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
  const contentRef = useRef(null)
  const toggleSidebar =() =>{
    if(sidebarVisible){
      setSidebarVisible(false);
      contentRef.current.style.marginLeft="0"
      contentRef.current.style.maxWidth="100%"

    }else{
      setSidebarVisible(true);
      contentRef.current.style.marginLeft="350px"
      contentRef.current.style.maxWidth="calc(100vw - 350px)"

    }
  }
  return (
    
    <div className="flex  w-full min-h-screen p-0">
      <div
        className="w-full "
        style={{
          backgroundColor: "#EFF3F8",
          display: "flex",
          flexDirection: "row",
          minHeight: "100%",
        }}
      >
        <Header
          toggleSidebar ={toggleSidebar}
          mobileSidebarVisible={mobileSidebarVisible}
          setMobileSidebarVisible={setMobileSidebarVisible}
        />
        {sidebarVisible && (
          <div>
            {" "}
            <Navigation />
          </div>
        )}
        {width < 990 && (
          <SlidebarNavigation
            visible={mobileSidebarVisible}
            setVisible={setMobileSidebarVisible}
          />
        )}
        <div ref={contentRef} className="content-container"> <Content /></div>
       

      </div>

      {/*<div className="flex flex-row w-full p-0">
       
      {sidebarVisible && (
        <div className="">
          <Navigation />
        </div>
      )}
      <div className="flex flex-column h-screen w-full">
        <Header visible={sidebarVisible} setVisible={setSidebarVisible} />
        <Content />
      </div>
      {width < 990 && (
        <SlidebarNavigation
          visible={sidebarVisible}
          setVisible={setSidebarVisible}
        />
      )}
    </div>
      */}
    </div>
  );
}

export default Layout;
