import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { TabView, TabPanel } from "primereact/tabview";
import { ProgressSpinner } from "primereact/progressspinner";
import ProductGallery from "./productGallery";
import ReviewForm from "./reviewForm";
import Reviews from "./reviews";
import ReviewSortingBtn from "./reviewSortBtn";
import { useParams } from "react-router-dom";
import { useShoppingCart } from "../contexts/shoppingCartContext";
import { Dialog } from "primereact/dialog";
function ProductPage(props) {
  const { name, id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [optionError, setOptionError] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedQty, setSelecetedQty] = useState(1);
  const [availableDialog, setAvailableDialog] = useState(false);
  const [reviewFormVisible, setReviewFormVisible] = useState(false);
  const [sortKey, setSortKey] = useState("");
  const { increaseQty } = useShoppingCart();

  const isAvailable = () => {
    if (selectedOption) {
      return selectedOption.total_stock >= selectedQty;
    } else {
      return product.total_stock >= selectedQty;
    }
  };
  const addToCart = () => {
    if (product.options.length > 0 && !selectedOption) {
      setOptionError(true);
      return;
    } else if (!isAvailable()) {
      setAvailableDialog(true);
      return;
    } else {
      if (selectedOption) {
        selectedOption.product = product;
        selectedOption.status = "option";
        increaseQty(selectedOption, selectedQty);
      } else {
        product.status = "main";
        increaseQty(product, selectedQty);
      }
      setSelecetedQty(1);
    }
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      let url = "http://localhost:3000/api/products/product";
      try {
        let res = await axios.post(url, { id });
        if (res.data.success && res.data.product) {
          setProduct(res.data.product);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    getData();
  }, [name, id]);

  return (
    <div className="surface-50">
      {isLoading ? (
        <div className="card flex justify-content-center">
          <ProgressSpinner />
        </div>
      ) : (
        product && (
          <div>
            <div className="grid w-full surface-0">
              {" "}
              {/* Container for Product Display + info*/}
              <div className="col-12 md:col-6 product-display card">
                <ProductGallery
                  product={product}
                  selectedOption={selectedOption}
                />
              </div>
              <div className="col-12 md:col-6 p-6 lg:p-3">
                {" "}
                {/*Product Info Container*/}
                <div className="productview-info">
                  <p className="text-3xl my-2">
                    ${selectedOption ? selectedOption.price : product.price}
                  </p>
                  <p className="text-5xl capitalize">{product.name}</p>
                  <p className="text-xl text-600">{product.category.name}</p>
                  {product.rating === 0 ? (
                    <p>No reviews</p>
                  ) : (
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
                          className: "text-yellow-500 m-0 p-0 ",
                        },
                      }}
                    />
                  )}

                  <Button
                    label="write a review"
                    text
                    className="p-0 my-2"
                    onClick={() => setReviewFormVisible(true)}
                  />
                </div>
                <div>
                  <p className="text-xl">
                    Availabilty :{" "}
                    <span className="text-sm ">
                      {product.total_stock === 0 ? (
                        <span className="text-red-600">OUT OF STOCK</span>
                      ) : product.total_stock <= 10 ? (
                        "LOW IN STOCK"
                      ) : (
                        "IN STOCK"
                      )}
                    </span>{" "}
                  </p>
                  <p className="text-xl">
                    Note : <span className="text-sm">Buy one get one free</span>
                  </p>
                </div>
                {product.options.length > 0 && (
                  <div className="productOptions">
                    <p className="text-2xl my-3">
                      Options<span className="text-pink-500">*</span>{" "}
                      {optionError && (
                        <span className="ml-1 text-red-500 text-lg">
                          Choose one!
                        </span>
                      )}
                    </p>
                    <div className="flex flex-column gap-3">
                      {product.options.map((op) => {
                        return (
                          <div
                            key={op.name}
                            className="flex align-items-center"
                          >
                            <RadioButton
                              inputId={op.name}
                              name="category"
                              value={op}
                              onChange={(e) => {
                                setOptionError(false);
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
                    style={{
                      height: "2px",
                      background: "var(--surface-ground)",
                    }}
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
                    style={{
                      height: "2px",
                      background: "var(--surface-ground)",
                    }}
                  />
                  <div className="flex-auto">
                    <Button
                      label="Add to cart"
                      className="w-full uppercase"
                      onClick={addToCart}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" my-3 p-2 md:p-4 lg:p-6 surface-0">
              <TabView>
                <TabPanel header="Description">
                  <p className="text-700">{product.description}</p>
                </TabPanel>
                <TabPanel header="Reviews">
                  <div className="flex justify-content-between flex-wrap row-gap-3 mb-3">
                    <div className=" flex flex-column sm:flex-row justify-content-between ">
                      <Rating
                        value={product.rating}
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
                      <p className="text-basis align-self-center font-semibold text-600">
                        {product.reviews.length} Reviews
                      </p>
                    </div>
                    <div className=" sm:ml-auto flex-order-4 w-12 sm:w-4 sm:flex-order-2 md:w-3">
                      <Button
                        className="w-full"
                        label="write a review"
                        outlined
                        onClick={() => {
                          setReviewFormVisible(true);
                        }}
                      />
                    </div>

                    <div className="ml-2 flex-order-3 flex align-items-center ">
                      <ReviewSortingBtn setSortKey={setSortKey} />
                    </div>
                  </div>

                  <Reviews sortKey={sortKey} reviews={product.reviews} />
                </TabPanel>
              </TabView>
            </div>
            <ReviewForm
              product={product}
              setProduct={setProduct}
              reviewFormVisible={reviewFormVisible}
              setReviewFormVisible={setReviewFormVisible}
            />

            <Dialog
              visible={availableDialog}
              onHide={() => setAvailableDialog(false)}
              header="Alert"
              footer={
                <div className="text-center">
                  <Button
                    label="Okay"
                    onClick={() => setAvailableDialog(false)}
                  />
                </div>
              }
              style={{ minWidth: "50%" }}
              draggable={false}
            >
              <div className="flex align-items-center">
                <i className="pi pi-exclamation-triangle text-3xl  border-circle p-3 text-800"></i>
                <p className="text-800 font-semibold">
                  Sorry, We don't have enough{" "}
                  <span className="capitalize">
                    {selectedOption ? selectedOption.name : product.name}
                  </span>
                  . Please, decrease your quantity.
                </p>
              </div>
            </Dialog>
          </div>
        )
      )}
    </div>
  );
}

export default ProductPage;
