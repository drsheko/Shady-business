import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BreadCrumb } from "primereact/breadcrumb";
import { Link } from "react-router-dom";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import ProductCard from "./productCard";

function Category(props) {
  const category = useLocation().state;
  const [products, setProducts] = useState([]);
  const item = (i, op) => {
    return <Link to="/">home </Link>;
  };
  const items = [{ label: "Computer", template: item }];
  const home = { icon: "pi pi-home", template: item };
  const [layout, setLayout] = useState("grid");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);
  const sortOptions = [
    { label: "Price High to Low", value: "!price" },
    { label: "Price Low to High", value: "price" },
    { label: "Highest Rating", value: "!rating" },
    { label: "A to Z", value: "name" },
    { label: "Z to A", value: "!name" },
    { label: "Default", value: "default" },
  ];

  const onSortChange = (event) => {
    const value = event.value;
    if (value === "default") {
      setSortField(null);
      setSortKey(null);
      return;
    }
    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const itemTemplate = (product, layout) => {
    if (!product) {
      return;
    }
    if (layout === "list")
      return <ProductCard product={product} layout={layout} />;
    else if (layout === "grid")
      return <ProductCard product={product} layout={layout} />;
  };

  const renderHeader = () => {
    return (
      <div className="grid grid-nogutter w-full">
        <div className="col-6 flex" style={{ textAlign: "left" }}>
          <p className="align-self-center mr-2">Sort</p>
          <Dropdown
            options={sortOptions}
            value={sortKey}
            optionLabel="label"
            placeholder=" By"
            onChange={onSortChange}
          />
        </div>
        <div className="col-6" style={{ textAlign: "right" }}>
          <DataViewLayoutOptions
            layout={layout}
            onChange={(e) => setLayout(e.value)}
          />
        </div>
      </div>
    );
  };

  const header = renderHeader();
  useEffect(() => {
    const getData = async () => {
      let url = "http://localhost:3000/api/categories/category";
      try {
        let id = category._id;
        let res = await axios.post(url, { id });
        setProducts(res.data.category.products);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
    console.log(category);
  }, []);

  return (
    <div>
      <BreadCrumb model={items} home={home} />
      <div className="card">
        <p className=" text-center text-4xl font-medium capitalize my-2">
          {" "}
          vape tanks
        </p>
      </div>
      <div className="dataview-demo flex flex-row">
        <div className="card w-full">
          <DataView
            value={products}
            layout={layout}
            header={header}
            itemTemplate={itemTemplate}
            paginator
            rows={12}
            sortOrder={sortOrder}
            sortField={sortField}
          />
        </div>
      </div>
    </div>
  );
}

export default Category;
