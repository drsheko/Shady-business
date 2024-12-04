import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function useNavigationlinks(props) {
  const navigate = useNavigate();
  const [linkClicked, setLinkClicked] = useState(false);
  const brands = {
    label: "Brands",
    command: () => {
      setLinkClicked(true);
      navigate(`/brands`);
    },
  };
  const coupons = {
    label: "coupons",
    command: () => {
      setLinkClicked(true);

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
                setLinkClicked(true);
                navigate(`/category/${category.name}/${category._id}`, { state: category  ,replace:true});
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
                  setLinkClicked(true);

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
        navigate('/error')
      }
    };
    getAllCategories();
  }, []);

  return { links, linkClicked, setLinkClicked };
}

export default useNavigationlinks;
