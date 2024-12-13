import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import axios from "axios";
import moment from "moment";
function BestSellerCategories(props) {
    const [categories, setCategories] = useState([]);
  //  const [monthsCount, setMonthsCount] = useState(ordersChartMonths);
 //   const [graph, setGraph] = useState(ordersChartGraph);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const getCategoriesData = (categories) => {
        let names =[] ;
        let sold = [];
        categories.map(cat => {
            let catName = cat.name;
            let _name = catName.charAt(0).toUpperCase() + catName.slice(1);
            names.push(_name);
            sold.push(cat.soldProducts)
        });

        return {names, sold}
    }

  
    useEffect(() => {
       // let months = getMonths(monthsCount);
        const getCategories = async () => {
          setIsLoading(true);
          let url = "https://shady-business-server.onrender.com/api/orders/cat";
          try {
            let res = await axios.post(url);
            if (res.data.success && res.data.categories) {
              setCategories(res.data.categories);
                let categoriesData = getCategoriesData(res.data.categories);
              const documentStyle = getComputedStyle(document.documentElement);
              const textColor = documentStyle.getPropertyValue("--text-color");
              const textColorSecondary = documentStyle.getPropertyValue(
                "--text-color-secondary"
              );
              const surfaceBorder =
                documentStyle.getPropertyValue("--surface-border");
              const data = {
                labels: categoriesData.names,
                datasets: [
                  {
                    label: "Categories",
                    backgroundColor: 
                    [documentStyle.getPropertyValue("--cyan-500"),
                    documentStyle.getPropertyValue("--yellow-500"),
                    documentStyle.getPropertyValue("--orange-500"),
                    documentStyle.getPropertyValue("--blue-500"),
                    documentStyle.getPropertyValue("--red-500"),
                    documentStyle.getPropertyValue("--indigo-500"),
                ],
                hoverBackgroundColor :[
                        documentStyle.getPropertyValue("--cyan-300"),
                        documentStyle.getPropertyValue("--yellow-300"),
                        documentStyle.getPropertyValue("--orange-300"),
                        documentStyle.getPropertyValue("--blue-300"),
                        documentStyle.getPropertyValue("--red-300"),
                        documentStyle.getPropertyValue("--indigo-300")
                    ],
                    data: categoriesData.sold,
                  },
                ],
              };
              const options = {
                
                plugins: {
                  legend: {
                    position:"bottom",
                    labels: {
                      fontColor: textColor,
                    },
                  },
                },
                
              };
    
              setChartData(data);
              setChartOptions(options);
              setIsLoading(false);
            }
          } catch (error) {
            setIsLoading(false);
            setError(true);
          }
        };
        getCategories();
      }, []);
    return (
        <div className="col-12 md:col-5  p-2  md:min-h-full">
        <div className="card mb-0 p-3 shadow-2 border-round-lg bg-white h-full">
       
            <p className="font-semibold text-lg mb-2">Best Selling Categories</p>
            <div className="mx-auto max-w-min"> 
            <Chart
          type="pie"
          data={chartData}
          options={chartOptions}
          className="w-full "
        />
            </div>
        
      </div>
      </div>
    );
}

export default BestSellerCategories;