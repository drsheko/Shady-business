import React, { useEffect, useState } from "react";
import axios from "axios";
import Coupon from "./coupon";

function Coupons(props) {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const getCoupons = async () => {
      let url = "http://localhost:3000/api/coupons/all";
      try {
        let res = await axios.get(url);
        setCoupons(res.data.coupons);
      } catch (error) {
        navigate('/error')
      }
    };
    getCoupons();
  }, []);
  return (
    <div className="p-2 sm:p-3 flex flex-column flex-wrap gap-3 align-items-center justify-content-center sm:flex-row">
      {coupons.length > 0
        ? coupons.map((item) => {
            return(
                <Coupon item={item} key={item._id}/>
            )
           
          })
        : "No Avialble coupons at moment come back later ....."}
    </div>
  );
}

export default Coupons;
