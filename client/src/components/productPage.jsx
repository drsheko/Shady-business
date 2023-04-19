import React, { useEffect, useState } from "react";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";

import { TabView, TabPanel } from "primereact/tabview";

import { Image } from "primereact/image";
import { Galleria } from "primereact/galleria";
import ProductGallery from "./gellaria";
import ReviewForm from "./reviewForm";
import Reviews from "./reviews";
import ReviewSortingBtn from "./reviewSortBtn";
const product = {
  id: "1000",
  code: "f230fh0g3",
  name: "Bamboo Watch",
  description: "Product Description",
  image: "vape1.avif",
  price: 65,
  category: "Accessories",
  quantity: 24,
  inventoryStatus: "INSTOCK",
  rating: 4.6,
};
const productOptions = [
  { name: "red", price: 0, photo: "vape2.avif", total_stock: 44 },
  { name: "blue", price: 0, photo: "vape3.avif", total_stock: 0 },
  { name: "green", price: 0, photo: "vape1.avif", total_stock: 44 },
];

const productReviews = [
  {
    user: { name: "shady" },
    rating: 4,
    note: "This flavor is awesome! I ordered strawberry Pina colada & strawberry ice cream. The only down side, is that the strawberry ice cream one is hitting, but it won't charge. No problems with the strawberry Pina colada. Ordering through the mail is never easy, but I'm glad I gave 8vape a shot! I wish we could control the delivery part though...one driver will leave it at the door, and another will knock or ring the bell. We pay for the adult signature page- that should be enough to leave it at the door without having to sign for it. Just my opinion. But I do recommend this company.",
    photo: "vape4.jpg",
    time: "2/17/2023",
  },
  {
    user: { name: "Hady" },
    rating: 3,
    note: "good product.. highly recommend",
    photo: "vape1.avif",
    time: "2/17/2023",
  },
  {
    user: { name: "Fadt" },
    rating: 2,
    note: "good product.. highly recommend",
    photo: "vape1.avif",
    time: "2/17/2023",
  },
  {
    user: { name: "Nady" },
    rating: 4,
    note: "good product.. highly recommend",
    photo: "",
    time: "2/17/2023",
  },
];

product.options = productOptions;
product.reviews = productReviews;

const galleryItemTemplate = (item) => {
  return (
    <img
      src={`../src/assets/vape/${item}`}
      alt={item}
      style={{ width: "250px", height: "300px", display: "block" }}
    />
  );
};
const thumbnailTemplate = (item) => {
  return (
    <img
      src={`../src/assets/vape/${item}`}
      alt={item}
      style={{ width: "50px", height: "50px", display: "block" }}
    />
  );
};

function ProductPage(props) {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedQty, setSelecetedQty] = useState(1);
  const tapOptions = ["Description", "Reviews"];
  const [sortKey, setSortKey] = useState("");
  const [images, setImages] = useState([
    "vape1.avif",
    "vape2.avif",
    "vape3.avif",
    "vape4.jpg",
  ]);

  useEffect(() => {
    let mainImage = product.image;
    let optionImages = product.options.map((opt) => {
      if (opt.photo !== "") {
        return opt.photo;
      }
    });

    // setImages( [ mainImage,...optionImages]);

    console.log(images);
  }, []);
  return (
    <div className="surface-50">
      <div className="grid w-full surface-0">
        {" "}
        {/* Container for Product Display + info*/}
        <div className="col-12 md:col-6 product-display card">
          <ProductGallery />
        </div>
        <div className="col-12 md:col-6 p-6 lg:p-3">
          {" "}
          {/*Product Info Container*/}
          <div className="productview-info">
            <p className="text-3xl my-2">${product.price}</p>
            <p className="text-5xl">{product.name}</p>
            <p className="text-xl">{product.category}</p>
            <Rating value={product.rating} readOnly cancel={false} />
            <Button label="write a review" text className="p-0 my-2" />
          </div>
          <div>
            <p className="text-xl">
              Availabilty :{" "}
              <span className="text-sm ">{product.inventoryStatus}</span>{" "}
            </p>
            <p className="text-xl">
              Note : <span className="text-sm">Buy one get one free</span>
            </p>
          </div>
          <div className="productOptions">
            <p className="text-2xl my-3">
              Options<span className="text-pink-500">*</span>
            </p>
            <div className="flex flex-column gap-3">
              {product.options.map((op) => {
                return (
                  <div key={op.name} className="flex align-items-center">
                    <RadioButton
                      inputId={op.name}
                      name="category"
                      value={op.name}
                      onChange={(e) => {
                        setSelectedOption(e.value);
                      }}
                      checked={op.name === selectedOption}
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
              <Button label="Add to cart" className="w-full uppercase" />
            </div>
          </div>
        </div>
      </div>
      <div className=" my-3 p-2 md:p-4 lg:p-6 surface-0">
        <TabView>
          <TabPanel header="Description">
            <p className="text-lg">{product.description}</p>
          </TabPanel>
          <TabPanel header="Reviews">
            <div className="flex justify-content-between flex-wrap row-gap-3 mb-3">
              <div className=" flex flex-column sm:flex-row justify-content-between ">
                <Rating
                  value={product.rating}
                  readOnly
                  cancel={false}
                  className="mr-3 "
                />
                <p className="text-basis align-self-center">
                  {product.reviews.length} Reviews
                </p>
              </div>
              <div className="ml-auto flex-order-4 col-12 sm:col-4 sm:flex-order-2 md:col-3">
                <ReviewForm product={product} className="w-full h-full" />
              </div>

              <div className="ml-2 flex-order-3 flex align-items-center ">
                <ReviewSortingBtn setSortKey={setSortKey} />
              </div>
            </div>

            <Reviews sortKey={sortKey} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
}

export default ProductPage;
