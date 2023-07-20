import React, { useEffect, useState } from "react";
import axios from "axios";
import { AutoComplete } from "primereact/autocomplete";
import { useNavigate } from "react-router-dom";

function Search(props) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const search = async (event) => {
    let _filteredProducts;

    if (!event.query.trim().length) {
      _filteredProducts = [...products];
    } else {
      _filteredProducts = products.filter((product) => {
        return product.name.toLowerCase().includes(event.query.toLowerCase());
      });
    }

    setFilteredProducts(_filteredProducts);
  };
  const itemTemplate = (item) => {
    return (
      <div
        className="flex flex-row align-items-center justify-content-between"
        onClick={() => onItemPressed(item)}
      >
        <div className="flex flex-row align-items-center">
        <img alt={item.name} src={item.photos[0]} style={{ width: "50px" }}  className="mr-2"/>
        <p className="text-900 font-semibold">{item.name}</p>
        </div>
        
        <p className="text-900 font-semibold mr-0 sm:mr-2 md:mr-4">${item.price}</p>
      </div>
    );
  };
  const onItemPressed = (item) => {
    navigate(`/product`, { state: item });
    props.setVisibleSearch(false);
  };
  useEffect(() => {
    const getData = async () => {
      let url = "http://localhost:3000/api/products/all";
      try {
        let res = await axios.get(url);
         setProducts(res.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  return (
    <div className="card w-full  p-3">
      <AutoComplete
        autoFocus={true}
        value={value}
        suggestions={filteredProducts}
        inputClassName="w-full"
        itemTemplate={itemTemplate}
        completeMethod={search}
        onChange={(e) => setValue(e.value)}
        className="min-w-full"
        field="name"
        />
    </div>
  );
}

export default Search;
