import React from "react";
import useNavigationlinks from "./useNavigationLinks";

function Footer(props) {
  const { links } = useNavigationlinks();

  return (
    <div>
      <div className="flex flex-row px-6 py-3 justify-content-between 	 bg-indigo-50">
        <div className="flex flex-column flex-nowrap">
          <p className="text-xl mb-3">Categories</p>

          {links && links.length > 0 && (
            <div className="flex flex-column">
              {links.map((link) => {
                return (
                  <a
                    key={link}
                    href={`/category/${link.label}`}
                    className="text-700 font-semibold no-underline hover:underline hover:text-primary my-2"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-column">
          <p className="text-xl mb-3">INFO</p>
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

        <div className="w-3">
          <p className="text-xl mb-3">Follow us</p>
          <div className="my-4 flex flex-row justify-content-between">
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
            className="bg-primary text-center p-3 my-5 border-3 shadow-3"
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
