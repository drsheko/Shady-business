import React, { useState, useEffect } from "react";
import moment from "moment";
import { DataView } from "primereact/dataview";
import { Image } from "primereact/image";
import { Rating } from "primereact/rating";
function Reviews(props) {
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState("");

  const onSortChange = (value) => {
    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
    } else {
      setSortOrder(1);
      setSortField(value);
    }
  };

  useEffect(() => {
    onSortChange(props.sortKey);
  }, [props.sortKey]);

  const reviewTemplate = (review) => {
    return (
      <div className="col-12 md:col-6 p-1 sm:p-2 md:p-3 ">
        <div className="review card  border-round-lg shadow-3 p-2 px-3 sm:p-3 md:p-4 my-1 md:my-0 flex flex-column row-gap-3  h-full">
          <div className="main-review flex flex-column row-gap-2 ">
            <p className="font-bold text-lg capitalize text-900">
              {review.user.firstName + " " + review.user.lastName}
            </p>
            <p className="font-light text-xs text-800">
              {moment(review.date).format("MMMM Do YYYY, h:mm a")}
            </p>
            <Rating value={review.rating} readOnly cancel={false} pt={{
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
                  }} />
            <p
              className="text-basis text-900"
              style={{ maxHeight: "250px", overflowY: "scroll" }}
            >
              {review.comment}
            </p>
          </div>

          <div className="flex flex-row flex-wrap ">
            {review.photos.length > 0
              ? review.photos.map((photo) => {
                  return (
                    <div className="review-image mx-1" dataKey={photo}>
                      <Image
                        src={photo}
                        preview
                        alt=""
                        width="64"
                        height="64"
                        className="shadow-3"
                      />
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="card ">
      <DataView
        value={props.reviews}
        itemTemplate={reviewTemplate}
        sortField={sortField}
        sortOrder={sortOrder}
        layout="grid"
        pt={{
          grid:{
            className:"p-0 m-0",
          }
        }}
      />
    </div>
  );
}

export default Reviews;
