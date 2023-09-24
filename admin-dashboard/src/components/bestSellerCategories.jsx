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
          let url = "http://localhost:3000/api/orders/cat";
          try {
            let res = await axios.post(url);
            if (res.data.success && res.data.categories) {
              setCategories(res.data.categories);
              console.log("data", res.data.categories)
                let categoriesData = getCategoriesData(res.data.categories);
                console.log("catData" , categoriesData)
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
                    [documentStyle.getPropertyValue("--green-500"),
                    documentStyle.getPropertyValue("--orange-500"),
                    documentStyle.getPropertyValue("--yellow-500"),
                    documentStyle.getPropertyValue("--blue-500"),
                    documentStyle.getPropertyValue("--red-500"),
                    documentStyle.getPropertyValue("--indigo-500"),
                ],
                hoverBackgroundColor :[
                        documentStyle.getPropertyValue("--green-300"),
                        documentStyle.getPropertyValue("--orange-300"),
                        documentStyle.getPropertyValue("--yellow-300"),
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
        <div className="card">
        <Chart
          type="pie"
          data={chartData}
          options={chartOptions}
          className="w-full "
        />
      </div>
    );
}

export default BestSellerCategories;