import React from "react";
import tanks from "../assets/tanks-ecigmafia.webp";
import { Link } from "react-router-dom";
function CategoryDisplay(props) {
  return (
    <div className="grid my-2 px-2 w-full">
      <div className=" col-12 md:col-6 card  ">
        <div>
          <a href="" >
            <img src={tanks} alt="" style={{ width: "100%", maxHeight:'220px' }} className="border-round-xl shadow-5" />
          </a>
        </div>
      </div>
      <div className=" col-12 md:col-6 card ">
        <div>
          
            <Link to='/category'>
            <img src={tanks} alt="" style={{ width: "100%", maxHeight:'220px' }} className="border-round-xl shadow-5"/>
            </Link>
            
          
        </div>
      </div>
      <div className=" col-12 md:col-6 card ">
        <div>
          <a href="">
            <img src={tanks} alt="" style={{ width: "100%", maxHeight:'220px' }}className="border-round-xl shadow-5" />
          </a>
        </div>
      </div>
      <div className=" col-12 md:col-6 card ">
        <div>
          <a href="">
            <img src={tanks} alt="" style={{ width: "100%", maxHeight:'220px' }} className="border-round-xl shadow-5"/>
          </a>
        </div>
      </div>
      <div className=" col-12 md:col-6 card ">
        <div>
          <a href="">
            <img src={tanks} alt="" style={{ width: "100%", maxHeight:'220px' }}className="border-round-xl shadow-5" />
          </a>
        </div>
      </div>
      <div className=" col-12 md:col-6 card ">
        <div>
          <a href="">
            <img src={tanks} alt="" style={{ width: "100%", maxHeight:'220px' }} className="border-round-xl shadow-5"/>
          </a>
        </div>
      </div>
    </div>
  );
}

export default CategoryDisplay;
