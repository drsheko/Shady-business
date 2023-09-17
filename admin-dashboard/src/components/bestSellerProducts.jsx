import React, { useState, useEffect } from "react";
import axios from "axios";
import { Rating } from "primereact/rating";

function BestSellerProducts(props) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        let url = "http://localhost:3000/api/orders/bestseller/products";
        let res = await axios.post(url);
        if (res.data.success && res.data.products) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);
  return (
    <div className="col-12 md:col-6 lg:col-4">
      <div className="flex flex-column gap-3">
        {products.length > 0 &&
          products.map((product) => {
            return (
              <div className="flex flex-row justify-content-between ">
                <div className="flex flex-row">
                  <div>
                    <img
                      src={product.photos[0]}
                      alt=""
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="flex flex-column h-6rem">
                    <p className="text-800 font-semibold mb-2">
                      {product.status === "main"
                        ? product.name
                        : product.product.name}
                    </p>

                    {product.status === "option" && (
                      <p className="text-500 capitalize my-0">{product.name}</p>
                    )}
                    <Rating
                      value={
                        product.status === "main"
                          ? product.rating
                          : product.product.rating
                      }
                      readOnly
                      cancel={false}
                      className="mr-3 "
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
                          className: "text-yellow-500 m-0 p-0 ",
                        },
                      }}
                    />
                  </div>
                </div>
                <p className="font-semibold text-green-600">${product.price}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default BestSellerProducts;
