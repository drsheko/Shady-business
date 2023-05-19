import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menubar } from "primereact/menubar";

function NavLinks(props) {
  const brands = {
    label: "Brands",
    url: "/brands",
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
            category = {
              id: category._id,
              label: category.name,
            };
            return category;
          } else {
            let sub = category.sub_categories;
            let subLinks = sub.map((el) => {
              el = {
                id: el._id,
                label: el.name,
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

        setLinks([brands, ...updated]);
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
