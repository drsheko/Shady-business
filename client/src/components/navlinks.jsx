import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Menubar } from "primereact/menubar";

function NavLinks(props) {
  const navigate = useNavigate();

  const brands = {
    label: "Brands",
    command: () => {
      navigate(`/brands`);
    },
  };
  const coupons = {
    label: "coupons",
    command: () => {
      navigate(`/coupons`);
    },
  };
  const [links, setLinks] = useState([brands]);

  useEffect(() => {
    // get All Categories ;
    const getAllCategories = async () => {
      let url = "http://localhost:3000/api/categories/all";
      try {
        let res = await axios.get(url);
        let categoryLinks = res.data.allCategories;
        let updated = categoryLinks.map((category) => {
          if (category.sub_categories.length === 0) {
            let link = {
              id: category._id,
              label: category.name,
              command: () => {
                navigate(`/category/${category.name}`, { state: category });
              },
            };
            return link;
          } else {
            let sub = category.sub_categories;
            let subLinks = sub.map((el) => {
              let id = el._id;
              let name = el.name;
              el = {
                id: id,
                label: name,
                command: () => {
                  navigate(`/${name}/${id}`);
                },
              };
              return el;
            });
            category = {
              id: category._id,
              label: category.name,
              items: subLinks,
            };
            return category;
          }
        });

        setLinks([brands, ...updated, coupons]);
      } catch (error) {
        console.log(error);
      }
    };

    getAllCategories();
  }, []);
  return (
    <div className="card">
      <Menubar model={links} breakpoint="360px" />
    </div>
  );
}

export default NavLinks;
