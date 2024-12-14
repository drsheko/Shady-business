import React from "react";
import tanks from "../assets/tanks-ecigmafia.webp";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CategoryDisplay(props) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const getAllCategories = async () => {
      let url = "https://shady-business-server.onrender.com/api/categories/all";
      try {
        let res = await axios.get(url);
        if (res.data.success && res.data.allCategories) {
          setCategories(res.data.allCategories);
        }
      } catch (error) {
        navigate("/error");
      }
    };
    getAllCategories();
  }, []);
  return (
    <div className="grid my-2 px-2 w-full lg:p-5">
      {categories.length > 0 &&
        categories.map((category) => {
          return (
            <div
              className=" col-12 sm:col-6 card lg:col-4 px-3 sm:px-1"
              onClick={() =>
                navigate(`/category/${category.name}/${category._id}`, {
                  replace: true,
                })
              }
            >
              <div className="relative border-round-xl h-10rem flex flex-column">
                <p
                  className="font-bold text-lg md:text-2xl capitalize no-underline z-3 text-white border-round p-1 px-2 absolute bg-primary"
                  style={{
                    transform: "skew(-10deg)",
                    top: "-10px",
                    left: "5px",
                    letterSpacing: "2px",
                    fontFamily: "sans",
                  }}
                >
                  {category.name}
                </p>

                <img
                  src={category.photo}
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                  className="border-round-xl shadow-5"
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default CategoryDisplay;
