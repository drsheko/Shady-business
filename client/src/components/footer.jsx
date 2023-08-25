import React from "react";
import useNavigationlinks from "./useNavigationLinks";
import {useNavigate} from "react-router-dom";
function Footer(props) {
  const { links } = useNavigationlinks();
  const navigate =useNavigate();

  const getLink = (link) =>{
    if(link.label.toLowerCase() === "coupons"|| link.label.toLowerCase() === "brands"){
      navigate(`/${link.label.toLowerCase()}`)
    } else{ 
      navigate(`/category/${link.label}/${link.id}`)
    }
  }
  return (
    <div className="mt-auto">
      <div className="flex flex-column md:flex-row px-3 sm:px-6 pb-3 justify-content-between bg-indigo-50 mt-3 ">
        <div className="flex flex-row  sm:justify-content-between w-full md:w-7 lg:w-9">
        <div className="flex flex-column flex-nowrap w-6">
          <p className="text-xl my-3 underline font-bold">Categories</p>

          {links && links.length > 0 && (
            <div className="flex flex-column">
              {links.map((link) => { 
                return (
                  <p
                    key={link.label}
                    onClick={()=> getLink(link)}
                    className="text-700 font-semibold no-underline hover:underline cursor-pointer hover:text-primary my-2"
                  >
                    {link.label}
                  </p>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-column w-6">
          <p className="text-xl my-3 underline font-bold ">Info</p>
          <a
            href="#"
            className="text-700 font-semibold no-underline hover:underline hover:text-primary my-2"
          >
            About
          </a>
          <a
            href="#"
            className="text-700 font-semibold no-underline hover:underline hover:text-primary my-2"
          >
            Contact us
          </a>
          <a
            href="#"
            className="text-700 font-semibold no-underline hover:underline hover:text-primary my-2"
          >
            Coupons
          </a>
          <a
            href="#"
            className="text-700 font-semibold no-underline hover:underline hover:text-primary my-2"
          >
            Age policy
          </a>
          <a
            href="#"
            className="text-700 font-semibold no-underline hover:underline hover:text-primary my-2"
          >
            Return policy
          </a>
          <a
            href="#"
            className="text-700 font-semibold no-underline hover:underline hover:text-primary my-2"
          >
            Terms & Conditions
          </a>
        </div>
        </div>
        <div className="w-12 md:w-5 lg:w-4 mt-1 sm:mt-0 ">
          <p className="text-xl my-3 underline font-bold">Follow us</p>
          <div className="my-4 flex flex-row justify-content-between px-4 sm:px-0">
            <i
              className="pi pi-facebook mr-2 cursor-pointer shadow-3 border-circle p-2"
              style={{ fontSize: "1.5rem", color: "#4267B2" }}
            ></i>
            <i
              className="pi pi-instagram mx-3 cursor-pointer shadow-3 border-circle p-2"
              style={{ fontSize: "1.5rem", color: "purple" }}
            ></i>
            <i
              className="pi pi-youtube mx-3 cursor-pointer shadow-3 border-circle p-2"
              style={{ fontSize: "1.5rem", color: "red" }}
            ></i>
            <i
              className="pi pi-twitter mx-2 cursor-pointer shadow-3 border-circle p-2"
              style={{ fontSize: "1.5rem", color: "#00acee" }}
            ></i>
          </div>
          <div
            className="bg-primary text-center mx-4 sm:mx-0 p-3 my-5 border-3 shadow-3"
            style={{
              transform: "skew(15deg)",
              borderRadius: " 0px 25px 0px 25px ",
            }}
          >
            <p
              className="font-bold text-xl text-0 "
              style={{ transform: "skew(-15deg" }}
            >
              Vaporesta
            </p>
          </div>
        </div>
      </div>
      <div className="bg-primary text-center p-3 border-1">
        <p className="">
          Copyright © 2023 <span className="font-bold">Shady Isreal</span>. All
          Rights Reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
