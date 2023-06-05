import React, { useEffect } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";

export default function AddToCartDialog({
  visible,
  setVisible,
  product,
  qty,
  shoppingListQty,
}) {
  const navigate = useNavigate();
  const header = () => {
    return (
      <p className="text-900 text-sm sm:text-base">
        Ok, {shoppingListQty()} items were added to your cart, what`s next?
      </p>
    );
  };
  const message = () => {
    return (
      <div className="flex flex-row justify-content-between w-full">
        <div>
          <img src={product.photos[0]} alt="" width={100} height={100} />
        </div>
        <div className="flex flex-column pl-3 sm:pl-4 pr-1">
          <p className="text-primary font-semibold text-lg my-2">
            {product.status === "main" ? product.name : product.product.name}
          </p>
          <p className="text-900 font-medium ">
            {qty} x ${product.price}
          </p>
          {product.status === "option" ? (
            <div>
              <p className="text-900 my-2 uppercase font-medium">
                Option:{" "}
                <span className="text-500 capitalize font-semibold">
                  {product.name}
                </span>{" "}
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };
  const proceedToCheckout = () => {
    navigate("/checkout");
  };

  const viewCart = () => {
    navigate("/cart");
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      setVisible(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, [visible]);
  
  return (
    <div>
      {product ? (
        <ConfirmDialog
          position="right"
          draggable={false}
          closeOnEscape={true}
          visible={visible}
          onHide={() => setVisible(false)}
          acceptLabel="proceed to checkout"
          rejectLabel="view cart"
          reject={viewCart}
          accept={proceedToCheckout}
          header={header}
          message={message}
          contentClassName="border-top-1 border-bottom-1 border-300 py-3 px-1 "
          closeIcon={<i className="pi pi-times text-900"></i>}
          pt={{
            root: {
              className: "p-0",
            },
            header: {
              className:
                "flex flex-row justify-content-between py-2 px-2 px-1 sm:pl-3",
            },
            footer: {
              className: "px-2 py-3 sm:p-3",
            },
            rejectButton: {
              className: "text-sm sm:text-base p-2 sm:px-3 capitalize",
            },
            acceptButton: {
              className: "text-sm sm:text-base p-2 sm:px-3 capitalize",
            },
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
}
