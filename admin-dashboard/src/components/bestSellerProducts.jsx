import React, { useState, useEffect } from "react";
import axios from "axios";
import { Rating } from "primereact/rating";

function BestSellerProducts(props) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        let url = "https://shady-business-server.onrender.com/api/orders/bestseller/products";
        let res = await axios.post(url);
        if (res.data.success && res.data.products) {
          setProducts(res.data.products);
        }
      } catch (error) {
      
      }
    };
    getProducts();
  }, []);
  return (
    <div className="col-12 md:col-5 p-2 md:max-h-30rem">
      
      <div className="flex flex-column gap-3 shadow-3 border-round-lg p-3 bg-white h-full overflow-y-auto bestSellerProducts-card">
      <p className="font-semibold text-lg">Best Selling products</p>
        {products.length > 0 &&
          products.map((product) => {
            return (
              <div className="flex flex-row justify-content-between flex-wrap ">
                <div className="flex flex-row justify-content-start ">
                  <div>
                    <img
                      src={product.photos[0]}
                      alt=""
                      width={100}
                      height={100}
                      className="w-4rem h-4rem  mr-2 shadow-2 border-round-md"
                    />
                  </div>
                  <div className="flex flex-column justify-content-start align-items-start  p-0 m-0">
                    <p className="text-800 font-semibold m-0">
                      {product.status === "main"
                        ? product.name
                        : product.product.name}
                    </p>

                    {product.status === "option" && (
                      <p className="text-500 font-semibold capitalize my-0">{product.name}</p>
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
                <p className=" font-semibold text-green-600 ml-auto p-0 my-0">${product.price}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default BestSellerProducts;
