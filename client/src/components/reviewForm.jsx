import React from "react";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Rating } from "primereact/rating";
import { InputTextarea } from "primereact/inputtextarea";
function ReviewForm({ product }) {
  const [visible, setVisible] = useState(false);
  const [ratingValue, setRatingValue] = useState(null);
  const [comment, setComment] = useState("");
  const [slide,setSlide] =useState(1);

  const onRatingChange = (e) =>{
    setRatingValue(e.target.value);
    document.getElementsByClassName('slide1').classList.add('fadeoutleft animation-duration-1000');
    setSlide(2)
  }
  return (
    <div className="w-full h-full">
      <Button
        className="w-full"
        label="write a review"
        outlined
        onClick={() => setVisible(true)}
      />
      <Dialog
        header="Leave a review"
        visible={visible}
        
        onHide={() => setVisible(false)}
      >
        {
          slide ===1 ?
        
        <div className="slide1">
        <img
              className="max-w-full max-h-full"
              src={`../src/assets/vape/${product.image}`}
              alt=""
            />
            <div className="flex flex-column gap-2 mb-3">
                <label htmlFor="rating">
                  Rating:<span className="text-pink-600">*</span>
                </label>
                <Rating
                  id="rating"
                  value={ratingValue}
                  onChange={onRatingChange}
                  aria-describedby="rating"
                  cancel={false}
                  required
                />
              </div>
        </div>
:<div className="slide2">
  write a Comment
  <InputTextarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={8}
                  placeholder="write a comment"
                  aria-describedby="comment"
                  required
                />
</div>
        }


        {/*
        
        <div className="m-0 flex flex-column sm:flex-row ">
          <div className="col-12 sm:col-6 p-3">
            <img
              className="max-w-full max-h-full"
              src={`../src/assets/vape/${product.image}`}
              alt=""
            />
          </div>
          <div className=" col-12 sm:col-6 p-3 ">
            <form action="">
              <div className="flex flex-column gap-2 mb-3">
                <label htmlFor="rating">
                  Rating:<span className="text-pink-600">*</span>
                </label>
                <Rating
                  id="rating"
                  value={ratingValue}
                  onChange={(e) => setRatingValue(e.target.value)}
                  aria-describedby="rating"
                  cancel={false}
                  required
                />
              </div>
              <div className="flex flex-column gap-2">
                <label htmlFor="comment">
                  Comment:<span className="text-pink-600">*</span>
                </label>
                <InputTextarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={8}
                  placeholder="write a comment"
                  aria-describedby="comment"
                  required
                />
              </div>
              
            </form>
          </div>
        </div>
        */}
      </Dialog>
    </div>
  );
}

export default ReviewForm;
