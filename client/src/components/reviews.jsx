import React, {useState, useEffect} from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Image } from 'primereact/image';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
function Reviews(props) {
    const [products, setProducts] = useState([]);
    
    const [sortOrder, setSortOrder] = useState(0);
    const [sortField, setSortField] = useState('');
   
    const productReviews = [
        {
          user: { name: "shady" },
          rating: 5,
          note: "This flavor is awesome! I ordered strawberry Pina colada & strawberry ice cream. The only down side, is that the strawberry ice cream one is hitting, but it won't charge. No problems with the strawberry Pina colada. Ordering through the mail is never easy, but I'm glad I gave 8vape a shot! I wish we could control the delivery part though...one driver will leave it at the door, and another will knock or ring the bell. We pay for the adult signature page- that should be enough to leave it at the door without having to sign for it. Just my opinion. But I do recommend this company.",
          photo: "vape4.jpg",
          date: "2/17/2023",
        },
        {
          user: { name: "Hady" },
          rating: 3,
          note: "good product.. highly recommend",
          photo: "vape1.avif",
          date: "2/18/2023",
        },
        {
          user: { name: "Fadt" },
          rating: 2,
          note: "good product.. highly recommend",
          photo: "vape1.avif",
          date: "2/13/2023",
        },
        {
          user: { name: "Nady" },
          rating: 4,
          note: "good product.. highly recommend",
          photo: "",
          date: "2/22/2023",
        },
      ];
    const onSortChange = (value) => {
        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            
        } else {
            setSortOrder(1);
            setSortField(value);
        }
    };

    useEffect(()=>{
        onSortChange(props.sortKey)
    },[props.sortKey])
    const reviewTemplate = (review) => {
        return (
            <div className="col-12 md:col-6 p-1 sm:p-2 md:p-3">
                     <div className="review card  border-round-lg shadow-2 p-2 sm:p-3 md:p-4  flex flex-column row-gap-3 ">
              <div className="main-review flex flex-column row-gap-2 ">
                <p className="font-bold text-lg">
                  {review.user.name}
                </p>
                <p className="font-light text-xs text-500">
                  {review.date}
                </p>
                <Rating
                  value={review.rating}
                  readOnly
                  cancel={false}
                />
                <p
                  className="text-basis"
                  style={{ maxHeight: "250px", overflowY: "scroll" }}
                >
                  {review.note}
                </p>
              </div>
              {review.photo === "" ? (
                ""
              ) : (
                <div className="review-image ">
                  <Image
                    style={{ objectFit: "fill" }}
                    src={`../src/assets/vape/${review.photo}`}
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
              )}
            </div>
            </div>
        );
    };
    return (
        <div className="card ">
        <DataView value={productReviews} itemTemplate={reviewTemplate}  sortField={sortField} sortOrder={sortOrder} layout='list' />
    </div>
    );
}

export default Reviews;