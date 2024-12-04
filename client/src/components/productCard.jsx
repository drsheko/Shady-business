import React, { useEffect } from "react";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Link, useNavigate } from "react-router-dom";

function ProductCard({ product, layout }) {
  const navigate = useNavigate();

  return (
    <>
      {layout === "list" ? (
        <div className="col-12 sm:col-6 lg:col-4  p-2  border-0">
          {/* render product as a List item*/}
          <div className="flex flex-column">
            <div className="flex flex-row border-round-md shadow-4 w-full h-full ">
              <div className="w-5 border-round-md ">
                <img
                  src={product.photos[0]}
                  onError={(e) =>
                    (e.target.src =
                      "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
                  }
                  alt={product.name}
                  className="max-w-full h-full border-round-md"
                />
              </div>
              <div className="flex flex-column w-7 py-2 pl-2 text-overflow-ellipsis ">
                <div className="text-primary text-lg sm:text-xl  font-semibold capitalize white-space-nowrap	text-overflow-ellipsis max-w-full	 hover:text-primary hover:underline cursor-pointer">
                  {product.name}
                </div>
                <span className="font-semibold text-400 text-basis md:text-lg capitalize">
                  {product.category.name}
                </span>

                <div className="product-list-action my-2">
                  <div className="flex flex-column">
                    <Rating
                      value={product.rating}
                      readOnly
                      cancel={false}
                      pt={{
                        root: {
                          className: "text-sm max-w-7rem",
                        },
                        item: {
                          className: "text-800 m-0",
                        },
                        onIcon: {
                          className: "text-yellow-500 m-0",
                        },
                        offIcon: {
                          className: "text-yellow-500 m-0 p-0 text-sm w-1rem ",
                        },
                      }}
                    />
                    <span className="font-semibold text-400">
                      {product.reviews.length} review
                    </span>
                    <p className="text-green-700 font-semibold align-self-end mr-3">
                      ${product.price}
                    </p>
                  </div>
                </div>
                <Button
                  label="Add To Cart"
                  size="small"
                  className=" border-round-left-3xl	border-noround-right shadow-4 hover:shadow-6 my-2"
                  onClick={() =>
                    navigate(`/product/${product.name}/${product._id}`, {
                      state: product,
                    })
                  }
                />
              </div>
            </div>
            <div>
              
            </div>
          </div>
        </div>
      ) : (
        <div className="col-12 sm:col-6 md:col-4  lg:col-3 m-2 shadow-3 border-round-lg surface-ground	max-w-10rem	sm:max-w-12rem	">
          {" "}
          {/* render product as a grid item*/}
          <div className="flex flex-column card border-round-lg shadow-4">
            <img
              src={product.photos[0]}
              alt=""
              className="w-full border-noround border-round-top-lg h-10rem sm:h-12rem"
            />
            <div className="flex flex-column p-3 text-center">
              <p className="font-semibold text-lg sm:text-xl text-primary cursor-pointer  capitalize">
                {product.name}
              </p>
              <p className="font-medium text-sm sm:text-base capitalize text-600 ">
                {product.category.name}
              </p>
              <div className="flex flex-row justify-content-center">
                <Rating
                  value={product.rating}
                  readOnly
                  cancel={false}
                  pt={{
                    root: {
                      className: "text-sm max-w-7rem",
                    },
                    item: {
                      className: "text-800 m-0",
                    },
                    onIcon: {
                      className: "text-yellow-500 m-0",
                    },
                    offIcon: {
                      className: "text-yellow-500 m-0 p-0 text-sm w-1rem ",
                    },
                  }}
                ></Rating>
                <span className="ml-1 text-800">
                  ({product.reviews.length})
                </span>
              </div>
            </div>
            <div className="flex flex-row justify-content-between align-items-center mb-4">
              <p className="ml-3 font-semibold text-green-700">
                {" "}
                ${product.price}
              </p>
              <Button
                label="Add To Cart"
                size="small"
                className="hidden sm:block border-round-left-3xl	border-noround-right shadow-4 hover:shadow-6"
                onClick={() =>
                  navigate(`/product/${product.name}/${product._id}`, {
                    state: product,
                  })
                }
              />
              <Button
                icon="pi pi-shopping-cart"
                size="small"
                rounded
                raised
                className="sm:hidden shadow-4 hover:shadow-6 mr-3"
                onClick={() =>
                  navigate(`/product/${product.name}/${product._id}`, {
                    state: product,
                  })
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
