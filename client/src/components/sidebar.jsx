import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Sidebar } from "primereact/sidebar";
import { TieredMenu } from "primereact/tieredmenu";
import { Divider } from "primereact/divider";

function SideNavbar(props) {
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

        setLinks([...updated, brands]);
      } catch (error) {
        console.log(error);
      }
    };

    getAllCategories();
  }, []);

  return (
    <div>
      <Sidebar visible={props.visible} onHide={() => props.setVisible(false)}>
        <h2>Vaporesta</h2>
        <Divider />
        <TieredMenu model={links} className="w-full" breakpoint="990px" />
      </Sidebar>
    </div>
  );
}

export default SideNavbar;
