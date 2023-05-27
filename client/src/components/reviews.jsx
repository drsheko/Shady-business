import React, { useState, useEffect } from "react";
import moment from "moment";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Image } from "primereact/image";
import { Dropdown } from "primereact/dropdown";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
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
      <div className="col-12 md:col-6 p-1 sm:p-2 md:p-3">
        <div className="review card  border-round-lg shadow-2 p-2 sm:p-3 md:p-4  flex flex-column row-gap-3 ">
          <div className="main-review flex flex-column row-gap-2 ">
            <p className="font-bold text-lg capitalize">
              {review.user.firstName + " " + review.user.lastName}
            </p>
            <p className="font-light text-xs text-500">
              {moment(review.date).format("MMMM Do YYYY, h:mm a")}
            </p>
            <Rating value={review.rating} readOnly cancel={false} />
            <p
              className="text-basis"
              style={{ maxHeight: "250px", overflowY: "scroll" }}
            >
              {review.comment}
            </p>
          </div>
          {review.photos.length > 0 ? (
            <div className="review-image ">
              <Image
                style={{ objectFit: "fill" }}
                src={review.photos[0]}
                onError={(e) =>
                  (e.target.src =
                    "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
                }
                alt=""
                preview
                width="124"
                height="100"
              />
            </div>
          ) : (
            ""
          )}
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
        layout="list"
      />
    </div>
  );
}

export default Reviews;
