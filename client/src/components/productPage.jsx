import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { TabView, TabPanel } from "primereact/tabview";
import { Image } from "primereact/image";
import { Galleria } from "primereact/galleria";
import ProductGallery from "./productGallery";
import ReviewForm from "./reviewForm";
import Reviews from "./reviews";
import ReviewSortingBtn from "./reviewSortBtn";
import { Link, useLocation } from "react-router-dom";
import { useShoppingCart } from "../contexts/shoppingCartContext";
function ProductPage(props) {
  const myProduct = useLocation().state;
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedQty, setSelecetedQty] = useState(1);
  const tapOptions = ["Description", "Reviews"];
  const [sortKey, setSortKey] = useState("");
  const {
    shoppingList,
    getItemQty,
    increaseQty,
    decreaseQty,
    removeItem,
    shoppingListQty,
  } = useShoppingCart();

  const addToCart = () => {
    if(selectedOption){
      selectedOption.product= myProduct;
      selectedOption.status='option'
      increaseQty(selectedOption,selectedQty);
    }else{
      myProduct.status='main'
      increaseQty(myProduct, selectedQty)
    }
    setSelecetedQty(1)
  };

 

  return (
    <div className="surface-50">
      <div className="grid w-full surface-0">
        {" "}
        {/* Container for Product Display + info*/}
        <div className="col-12 md:col-6 product-display card">
          <ProductGallery product={myProduct} selectedOption={selectedOption} />
        </div>
        <div className="col-12 md:col-6 p-6 lg:p-3">
          {" "}
          {/*Product Info Container*/}
          <div className="productview-info">
            <p className="text-3xl my-2">${selectedOption?(selectedOption.price): myProduct.price}</p>
            <p className="text-5xl">{myProduct.name}</p>
            <p className="text-xl">{myProduct.category.name}</p>
            {myProduct.rating === 0 ? (
              <p>No reviews</p>
            ) : (
              <Rating value={myProduct.rating} readOnly cancel={false} />
            )}

            <Button label="write a review" text className="p-0 my-2" />
          </div>
          <div>
            <p className="text-xl">
              Availabilty :{" "}
              <span className="text-sm ">
                {myProduct.total_stock === 0
                  ? "OUT OF STOCK"
                  : myProduct.total_stock <= 10
                  ? "LOW IN STOCK"
                  : "IN STOCK"}
              </span>{" "}
            </p>
            <p className="text-xl">
              Note : <span className="text-sm">Buy one get one free</span>
            </p>
          </div>
          {myProduct.options.length > 0 && (
            <div className="productOptions">
              <p className="text-2xl my-3">
                Options<span className="text-pink-500">*</span>
              </p>
              <div className="flex flex-column gap-3">
                {myProduct.options.map((op) => {
                  return (
                    <div key={op.name} className="flex align-items-center">
                      <RadioButton
                        inputId={op.name}
                        name="category"
                        value={op}
                        onChange={(e) => {
                          setSelectedOption(e.value);
                        }}
                        checked={op === selectedOption}
                        disabled={op.total_stock === 0}
                      />
                      <label
                        htmlFor={op.name}
                        className={
                          op.total_stock === 0
                            ? "ml-2 line-through text-500"
                            : "ml-2 text-900"
                        }
                      >
                        {op.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div>
            <Divider
              className="text-900 "
              type="solid"
              style={{ height: "2px", background: "var(--surface-ground)" }}
            />
            <div className="flex flex-row justify-content-start">
              <p className="text-xl align-self-center mr-5">Quantity:</p>
              <InputNumber
                value={selectedQty}
                onValueChange={(e) => setSelecetedQty(e.value)}
                showButtons
                buttonLayout="horizontal"
                step={1}
                min={1}
                decrementButtonClassName="p-button-primary"
                incrementButtonClassName="p-button-primary"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
              />
            </div>
            <Divider
              className="text-900 "
              type="solid"
              style={{ height: "2px", background: "var(--surface-ground)" }}
            />
            <div className="flex-auto">
              <Button label="Add to cart" className="w-full uppercase" onClick={addToCart} />
            </div>
          </div>
        </div>
      </div>
      <div className=" my-3 p-2 md:p-4 lg:p-6 surface-0">
        <TabView>
          <TabPanel header="Description">
            <p className="text-lg">{myProduct.description}</p>
          </TabPanel>
          <TabPanel header="Reviews">
            <div className="flex justify-content-between flex-wrap row-gap-3 mb-3">
              <div className=" flex flex-column sm:flex-row justify-content-between ">
                <Rating
                  value={myProduct.rating}
                  readOnly
                  cancel={false}
                  className="mr-3 "
                />
                <p className="text-basis align-self-center">
                  {myProduct.reviews.length} Reviews
                </p>
              </div>
              <div className="ml-auto flex-order-4 col-12 sm:col-4 sm:flex-order-2 md:col-3">
                <ReviewForm product={myProduct} className="w-full h-full" />
              </div>

              <div className="ml-2 flex-order-3 flex align-items-center ">
                <ReviewSortingBtn setSortKey={setSortKey} />
              </div>
            </div>

            <Reviews sortKey={sortKey} reviews={myProduct.reviews} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
}

export default ProductPage;
