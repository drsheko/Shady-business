import React, { useEffect } from "react";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Link } from "react-router-dom";

function ProductCard({product, layout}) {
  
  return (
    <>
      {layout === "list" ? (
        <div className="col-12 card shadow-4 p-2 border-round-lg">
          {" "}
          {/* render product as a List item*/}
          <div className="product-list-item ">
            <img
             
              src={`../src/assets/vape/${product.image}`}
              onError={(e) =>
                (e.target.src =
                  "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
              }
              alt={product.name}
            />
            <div className="product-list-detail">
              <div className="product-name">{product.name}</div>
              <div className="product-description">{product.description}</div>
              <Rating value={product.rating} readOnly cancel={false}></Rating>
              <i className="pi pi-tag product-category-icon"></i>
              <span className="product-category">{product.category}</span>
            </div>
            <div className="product-list-action">
              <span className="product-price">${product.price}</span>
              <Button
                icon="pi pi-shopping-cart"
                label="Add to Cart"
                disabled={product.inventoryStatus === "OUTOFSTOCK"}
              ></Button>
              <span
                className={`product-badge status-${product.inventoryStatus.toLowerCase()}`}
              >
                {product.inventoryStatus}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="col-12 sm:col-6 md:col-4  lg:col-3">
          {" "}
          {/* render product as a grid item*/}
          <div className="product-grid-item card border-round-lg shadow-4">
            <div className="product-grid-item-top">
              <div>
                <i className="pi pi-tag product-category-icon"></i>
                <span className="product-category">{product.category}</span>
              </div>
              <span
                
              >
                {product.inventoryStatus}
              </span>
            </div>
            <div className="product-grid-item-content">
              <img className="border-round-lg"
                src={`../src/assets/vape/${product.image}`}
                onError={(e) =>
                  (e.target.src =
                    "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
                }
                alt={product.name}
              />
              <div className="product-name"><Link to='/product' className="no-underline">{product.name}</Link> </div>
              <div className="product-description">{product.description}</div>
              <Rating value={product.rating} readOnly cancel={false}></Rating>
            </div>
            <div className="product-grid-item-bottom">
              <span className="product-price">${product.price}</span>
              <Button
                icon="pi pi-shopping-cart"
                label="Add to Cart"
                disabled={product.inventoryStatus === "OUTOFSTOCK"}
              ></Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
