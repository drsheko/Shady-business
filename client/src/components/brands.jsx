import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate ,Link} from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";
import HomeLink from "./homeLink";
import { ProgressSpinner } from "primereact/progressspinner";
function Brands(props) {
    const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const brandsLink = (<p className="text-800">Brands</p>)
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      let url = "http://localhost:3000/api/brands/all";
      try {
        let res = await axios.get(url);
        if (res.data.success && res.data.brands) {
          setBrands(res.data.brands);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    getData();
  }, []);
  return (
    <div className="" style={{minHeight:`calc(100vh - 350px)`}}>
      {isLoading ? (
        <div className="card flex justify-content-center py-8">
          <ProgressSpinner />
        </div>
      ) : (
        <div >
         <BreadCrumb model={[{template:brandsLink}]} home={HomeLink}  />
         <div className="p-3">

            <p className="text-800 font-semibold text-3xl text-center my-3">Brands</p>
            <div className="sm:px-2 md:px-4 lg:px-6">
        <div className=" grid p-4">
          {brands.length > 0 &&
            brands.map((brand) => {
              return (
                <div
                  className="brand col-6 h-5rem sm:col-4 sm:h-7rem md:col-3 md:h-8rem lg:col-3 lg:h-8rem  cursor-pointer"
                  key={brand.name}
                  onClick={()=>navigate(`/brand/${brand.name}/${brand._id}`)}
                >
                  <img
                    src={brand.photo}
                    alt={brand.name}
                    className="shadow-5 border-round-lg w-full h-full"
                  />
                </div>
              );
            })}
        </div>
        </div>
        </div>
        </div>
      )}
    </div>
  );
}

export default Brands;
