import React from "react";
import { useState, useEffect } from "react";
import { BreadCrumb } from "primereact/breadcrumb";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import ProductCard from "./productCard";

function SubCategory(props) {
  const { id, name } = useParams();
  const [subcategory, setSubcategory] = useState(null);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState(null);
  const homeLink = (i, op) => {
    return (
      <Link to="/">
        <p className="text-primary underline">Home</p>{" "}
      </Link>
    );
  };
  const categoryLink = (i, op) => {
    return (
      <Link to={`/category/${category.name}/${category._id}`}>
        <p className="text-primary underline">{category.name}</p>{" "}
      </Link>
    );
  };
  const subLink = <p className="capitalize text-800">{name}</p>;
  const home = { icon: "pi pi-home", template: homeLink };
  const links = [{ template: categoryLink }, { template: subLink }];
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
    return <ProductCard product={product} layout={layout} />;
  };

  const renderHeader = () => {
    return (
      <div className="grid grid-nogutter">
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
      setIsLoading(true);
      let url = `http://localhost:3000/api/subCategories/subcategory/${id}`;
      try {
        let res = await axios.get(url);
        if (res.data.success && res.data.subCategory) {
          setSubcategory(res.data.subCategory);
          setCategory(res.data.subCategory.category);
          setProducts(res.data.subCategory.products);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    getData();
  }, [id, name]);
  return (
    <div>
      {isLoading ? (
        <div className="card flex justify-content-center pt-8">
          <ProgressSpinner className="my-auto" />
        </div>
      ) : subcategory ? (
        <div className="min-h-screen flex flex-column">
          <BreadCrumb model={links} home={home} />
          <div className="card">
            <p className=" text-center text-4xl font-medium capitalize my-2">
              {subcategory.name}
            </p>
          </div>
          <div className="dataview-demo flex flex-row min-h-screen ">
            <div className="card w-full h-full">
              <DataView
                value={products}
                layout={layout}
                header={header}
                itemTemplate={itemTemplate}
                paginator
                paginatorClassName="border-none mt-auto"
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sortOrder={sortOrder}
                sortField={sortField}
                className="align-self-end "
                pt={{
                  grid: {
                    className:
                      "flex flex-row flex-wrap justify-content-stretch p-1",
                  },
                  root: {
                    className: "min-h-screen flex flex-column ",
                  },
                  paginator: {
                    className:
                      "bottom-0 absolute left-0 bottom-0  bg-red-400 border-none",
                  },
                  emptyMessage: {
                    className:
                      "text-center my-8 text-300 font-semibold text-lg",
                  },
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default SubCategory;
