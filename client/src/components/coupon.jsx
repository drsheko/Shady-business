import React from "react";
import moment from "moment";
function Coupon(props) {
  return (
    <div className="card border-5 border-dashed flex flex-column w-17rem border-round-xl  shadow-4">
      <div
        className=" border-round-top-lg p-3"
        style={{ backgroundColor: "red" }}
      >
        <p
          className="font-lg uppercase font-bold text-0 text-center line-height-4"
          style={{ fontFamily: "cursive" }}
        >
          discount coupon
        </p>
      </div>
      {props.item.data.photo ? (
        <img
          src={props.item.data.photo}
          alt={props.item.name}
          className="w-full"
          height={150}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = "./src/assets/vape/sale.jpg";
          }}
        />
      ) : (
        ""
      )}
      <div className="flex flex-column px-3 py-1">
        <p
          className="font-bold text-2xl text-center mb-2 text-teal-700 font-italic"
          style={{ textShadow: "1px 0px var(--teal-600)" }}
        >
          {props.item.name}
        </p>

        <p className="font-normal text-lg">{props.item.description}. </p>
        {props.item.minimumPurchase < 0 ? (
          <p className="font-semibold font-italic text-teal-700 capitalize">
            No minimum purchase.
          </p>
        ) : (
          <p className="font-semibold font-italic text-900">
            With your ${props.item.minimumPurchase} order.
          </p>
        )}
      </div>
      <div className="flex flex-column bg-gray-200 border-round-bottom-lg p-3">
        <p className="font-normal capitalize mb-1">
          {" "}
          use promo code :{" "}
          <span className="uppercase font-semibold font-italic shadow-6 px-1 select-all border-round text-teal-700">
            {props.item.code}
          </span>
        </p>
        <p className="font-normal text-red-500 capitalize">
          expires: {moment(props.item.expireDate).format("MMMM Do, YYYY")}
        </p>
      </div>
    </div>
  );
}

export default Coupon;
