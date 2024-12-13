import React, {useState, useEffect} from 'react';
import axios from "axios";
import { ProgressSpinner } from "primereact/progressspinner";
import ProductCard from './productCard2';
import { useParams } from 'react-router-dom';
import { BreadCrumb } from "primereact/breadcrumb";
import { Link } from "react-router-dom";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import HomeLink from './homeLink';
function Brand(props) {
    const{ id, name} = useParams();
    const [brand, setBrand] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [layout, setLayout] = useState("grid");
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const sortOptions = [
      { label: "Price High to Low", value: "!price" },
      { label: "Price Low to High", value: "price" },
      { label: "Highest Rating", value: "!rating" },
      { label: "A to Z", value: "name" },
      { label: "Z to A", value: "!name" },
      { label: "Default", value: "default" },
    ];
    const brandLink=(<p className='text-800 uppercase'>{name}</p>)
    const brands = ( <Link to="/brands">
    <p className="text-primary underline">Brands</p>
  </Link>)
    const links = [{ template: brands }, {template:brandLink}];

    const onSortChange = (event) => {
        const value = event.value;
        if (value === "default") {
          setSortField(null);
          setSortKey(null);
          return;
        }
        if (value.indexOf("!") === 0) {
          setSortOrder(-1);
          setSortField(value.substring(1, value.length));
          setSortKey(value);
        } else {
          setSortOrder(1);
          setSortField(value);
          setSortKey(value);
        }
      };
    
      const itemTemplate = (product, layout) => {
        if (!product) {
          return;
        }
        if (layout === "list")
          return <ProductCard product={product} layout={layout} />;
        else if (layout === "grid")
          return <ProductCard product={product} layout={layout} />;
      };
    
      const renderHeader = () => {
        return (
          <div className="grid grid-nogutter w-full">
            <div className="col-6 flex" style={{ textAlign: "left" }}>
              <p className="align-self-center mr-2">Sort</p>
              <Dropdown
                options={sortOptions}
                value={sortKey}
                optionLabel="label"
                placeholder=" By"
                onChange={onSortChange}
              />
            </div>
            <div className="col-6" style={{ textAlign: "right" }}>
              <DataViewLayoutOptions
                layout={layout}
                onChange={(e) => setLayout(e.value)}
              />
            </div>
          </div>
        );
      };
    
      const header = renderHeader();

    useEffect(() => {
        const getData = async () => {
          setIsLoading(true);
          let url = "https://shady-business-server.onrender.com/api/brands/brand";
          try {
            let res = await axios.post(url, {id});
            if (res.data.success && res.data.brand) {
              setBrand(res.data.brand);
              setProducts(res.data.brand.products);
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
           brand ? (
              <div className=" flex flex-column" style={{minHeight:`calc(100vh - 350px)`}}>
                <BreadCrumb model={links} home={HomeLink}  />
                <div className="card">
                  <p className=" text-center text-4xl font-medium capitalize my-2">
                    {brand.name}
                  </p>
                </div>
                <div className="dataview-demo flex flex-row min-h-screen">
                  <div className="card w-full h-full">
                    <DataView
                      value={products}
                      layout={layout}
                      header={header}
                      itemTemplate={itemTemplate}
                      paginator
                      paginatorClassName="border-none mt-auto"
                      rows={5}
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      tableStyle={{ minWidth: "50rem" }}
                      sortOrder={sortOrder}
                      sortField={sortField}
                      lazy={true}
                      className="align-self-end "
                      pt={{
                        grid: {
                          className:
                            "flex flex-row flex-wrap justify-content-stretch px-6",
                        },
                        root: {
                          className: "min-h-screen flex flex-column ",
                        },
                        paginator: {
                          className:
                            "bottom-0 absolute left-0 bottom-0  bg-red-400 border-none",
                        },
                        emptyMessage:{
                          className:"text-center my-8 text-300 font-semibold text-lg"
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )
            :""
          )}
      </div>
    );
}

export default Brand;