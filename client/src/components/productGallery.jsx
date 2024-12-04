import React, { useState, useEffect, useRef } from "react";
import { Galleria } from "primereact/galleria";

function ProductGallery({ product, selectedOption }) {
  const [images, setImages] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const galleria = useRef(null);

  const getProductPhotos = (product) => {
    let productOptionsPhotos = [];
    if (product && product.options.length > 0) {
      product.options.map((op) => {
        op.photos.map((photo) => {
          productOptionsPhotos.push(photo);
        });
      });
      let photos = [...product.photos, ...productOptionsPhotos];
      setImages(photos);
    }else{
      setImages(product.photos)
    }
  };
  const getActivePhoto = () => {
    if (!selectedOption) {
      return;
    } else if (selectedOption.photos.length === 0) {
      return;
    } else {
      let firstPhoto = selectedOption.photos[0];
      if (images) {
        let ind = images.indexOf(firstPhoto);
        setActiveIndex(ind);
      }
    }
  };
  useEffect(() => {
    getProductPhotos(product);
  }, []);
  useEffect(() => {
    getActivePhoto();
  }, [selectedOption]);

  const itemTemplate = (item) => {
    return (
      <img
        src={item}
        alt={item}
        style={{ maxWidth: "100%", maxHeight: "400px", display: "block" }}
      />
    );
  };

  const thumbnailTemplate = (item) => {
    return <img src={item} alt={item} style={{ display: "block" }} />;
  };

  return (
    <>
      {images ? (
        <div className="card flex flex-column justify-content-center p-3">
          <Galleria
            ref={galleria}
            value={images}
            numVisible={7}
            style={{ maxWidth: "100%" }}
            activeIndex={activeIndex}
            onItemChange={(e) => setActiveIndex(e.index)}
            circular
            showItemNavigators
            showThumbnails={false}
            item={itemTemplate}
            thumbnail={thumbnailTemplate}
          />
          <div className="w-full h-full flex flex-wrap row-gap-2 column-gap-2 justify-content-start my-2 ">
            {images &&
              images.map((image, index) => {
                let imgEl = (
                  <img
                    src={image}
                    alt={image}
                    style={{
                      cursor: "pointer",
                      width: "67.5px",
                      height: "67.5px",
                    }}
                    onClick={() => {
                      setActiveIndex(index);
                    }}
                    className={index === activeIndex ? "active" : "opacity-80"}
                  />
                );
                return (
                  <div className="" key={index}>
                    {imgEl}
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        "loading"
      )}
    </>
  );
}

export default ProductGallery;
