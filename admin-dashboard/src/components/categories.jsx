import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Toolbar } from "primereact/toolbar";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Carousel } from "primereact/carousel";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Rating } from "primereact/rating";
import { TreeTable } from "primereact/treetable";

function Categories(props) {
  let productForm = {
    name: "",
    price: null,
    retail_price: null,
    total_stock: 0,
    brand: null,
    description: "",
    photos: [],
    related_products: [],
    options: [],
    reviews: [],
    rating: 0,
    deals: [],
    subCategory: null,
    category: null,
  };
  const [nodes, setNodes] = useState([]);
  const toast = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });
  // ###############################//...(1) DATA TABLE LAYOUT...\\#########################################
  //###################### (1-A) TABLE FUNCTIONS ##############################
  const clearFilter = () => {
    initFilters();
  };
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue("");
  };
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  ///###############...(1-B) TABLE LAYOUT...##################################
  const toolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => setDeleteCategoriesDialog(true)}
          disabled={!selectedCategories || !selectedCategories.length}
        />
      </div>
    );
  };
  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          onClick={clearFilter}
          className="sm:hidden"
          disabled={!globalFilterValue}
        />
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          onClick={clearFilter}
          className="hidden sm:block"
          disabled={!globalFilterValue}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };
  const header = renderHeader();

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex flex-row flex-nowrap justify-content-center">
        <Button
          icon="pi pi-pencil"
          rounded
          size="small"
          className="mr-2"
          onClick={() => editCategory(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          size="small"
          severity="danger"
          onClick={() => confirmDeleteCategory(rowData)}
        />
      </div>
    );
  };
  const photoBodyTemplate = (node) => {
    return (
      <div className="card">
        <img
          src={
            node.data.status === "product"
              ? node.data.photos[0]
              : node.data.photo
          }
          alt=""
          height={50}
          width={70}
          className="shadow-4"
        />
      </div>
    );
  };
  // #############################//...(2) CREATE/EDIT PROCUCT DIALOG ...\\##############################################

  //####################...(2-A) CREATE/EDIT FUNCTIONS ...#################
  const onFormChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setProduct({ ...product, [name]: value });
  };
  const editProduct = (product) => {
    setProduct({ ...product });
    setPhotos(product.photos);
    setProductDialog(true);
  };
  const openNew = () => {
    setPhotos([]);
    setProduct(productForm);
    setSelectedProducts([]);
    setSubmitted(false);
    setPhotoError(false);
    setProductDialog(true);
  };
  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
    setFiles([]);
    setPhotoError(false);
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    if (product.photos.length === 0 && files.length === 0) {
      setPhotoError(true);
      const div = () => document.getElementById("productForm");
      div().scrollIntoView();
      return;
    } else {
      setPhotoError(false);
    }
    setSubmitted(true);
    if (product._id) {
      // save edited product
      let url = "http://localhost:3000/api/products/edit/product";
      try {
        let data = { ...product, FileList: files };
        let res = await axios.postForm(url, data);
        if (res.data.success && res.data.product) {
          let index = products.findIndex((el) => el._id === product._id);
          let _products = [...products];
          let _product = res.data.product;
          _products[index] = _product;
          setProducts(_products);
          setFiles([]);
          setProductDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `${_product.name} product updated`,
            life: 3000,
          });
          setSubmitted(false);
        }
      } catch (error) {
        setSubmitted(false);
        setFiles([]);
        setProductDialog(false);
        toast.current.show({
          severity: "error",
          summary: "ERROR",
          detail: `${product.name} product update failed.`,
          life: 3000,
        });
      }
    } else {
      //---------------CREATE A NEW Product------------------
      let url = "http://localhost:3000/api/products/addProduct";
      try {
        let data = { ...product, FileList: files };
        let res = await axios.postForm(url, data);
        console.log(res);
        let newProduct = res.data.product;
        let _products = [...products];
        if (res.data.success && res.data.product) {
          _products.push(newProduct);
          setProducts(_products);
          setSubmitted(false);
          setProduct(productForm);
          setFiles([]);
          setProductDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `${newProduct.name} coupon created`,
            life: 3000,
          });
        }
      } catch (error) {
        setSubmitted(false);
        setFiles([]);
        setProductDialog(false);
        toast.current.show({
          severity: "error",
          summary: "ERROR",
          detail: `Create a new product failed.`,
          life: 3000,
        });
      }
    }
  };
  const onTemplateSelect = (e) => {
    let file = e.files[0];
    const isFileDoubled = files.findIndex((ele) => ele.name === file.name);
    if (isFileDoubled === -1) {
      setFiles([...files, file]);
    }
  };

  const onTemplateRemove = (file, callback) => {
    callback();
    let updatedFiles = files.filter((f) => f !== file);
    setFiles(updatedFiles);
  };

  //######## Get Data From DB ###########
  useEffect(() => {
    const getCategories = async () => {
      let url = "http://localhost:3000/api/categories/all";
      try {
        let res = await axios.get(url);
        if (res.data.allCategories) {
          setCategories(res.data.allCategories);
          let _nodes = res.data.allCategories.map((category, i) => {
            if (category.sub_categories.length === 0) {
              let products = category.products.map((product, p) => {
                let productNode = {
                  key: `${i}-${p}`,
                  className:`bg-teal-50`,
                  data: { ...product, status: "product" },
                };
                return productNode;
              });
              let categoryNode = {
                key: `${i}`,
                className:`bg-red-50`,
                data: {
                  id: category._id,
                  status: "category",
                  name: category.name,
                  photo: category.photo,
                  products: category.products,
                },
                children: products,
              };
              return categoryNode;
            } else {
              let sub = category.sub_categories;
              let allProducts = category.products;
              let subCategoriesProducts =[]
              let subCategoryNodes = sub.map((el, j) => {
                let products = el.products.map((product, p) => {
                  let productNode = {
                    key: `${i}-${j}-${p}`,
                    className:`bg-teal-50`,
                    data: { ...product, status: "product" },
                  };
                  return productNode;
                });
                let subCategoryProducts =el.products
                subCategoriesProducts=[...subCategoryProducts]
                let subCategoryNode = {
                  key: `${i}-${j}`,
                  className:`bg-orange-50`,
                  data: {
                    id: el._id,
                    status: "subCategory",
                    name: el.name,
                    photo: el.photo,
                    products: el.products,
                  },
                  children: products,
                };
                return subCategoryNode;
              });
              let otherProducts =allProducts.filter(p =>!subCategoriesProducts.includes(p))
             let otherProductsNodes= otherProducts.map((product, p) => {
                let productNode = {
                  key: `${i}-*-${p}`,
                  className:`bg-primary-50`,
                  data: { ...product, status: "product" },
                };
               
                return productNode;
              })
              let childrenNodes =[...subCategoryNodes,...otherProductsNodes]
          
              category = {
                key: `${i}`,
                className:`bg-red-50`,
                data: {
                  id: category._id,
                  status: "category",
                  name: category.name,
                  photo: category.photo,
                  products: category.products,
                },
                children: childrenNodes,
              };
              return category;
            }
          });
          setNodes(_nodes);
        }
      } catch (error) {
        console.log(error);
        toast.current.show({
          severity: "error",
          summary: "SERVER ERROR",
          detail: "Internal error occured, please try again.",
          life: 3000,
        });
      }
    };
    const getSubCategories = async () => {
      let url = "http://localhost:3000/api/subCategories/all";
      try {
        let res = await axios.get(url);
        if (res.data.subCategories) {
          console.log(res.data.subCategories);

          setSubCategories(res.data.subCategories);
        }
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "SERVER ERROR",
          detail: "Internal error occured, please try again.",
          life: 3000,
        });
      }
    };

    getCategories();
    getSubCategories();
  }, []);
  return (
    <div>
      <div className="p-2 sm:p-3 card flex flex-column flex-wrap gap-3 align-items-center justify-content-center sm:flex-row">
        <Toolbar className="mb-4" left={toolbarTemplate}></Toolbar>

        <TreeTable
          value={nodes}
          key="key"
          size='small'
          showGridlines
          removableSort
          selectionMode="single"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          onSelectionChange={(e) => console.log(e.value)}
          onSelect={(e) => {
            console.log(e.node);
          }}
        >
          <Column
            field="name"
            header="Name"
            key="key"
            headerClassName="font-bold"
            bodyClassName="font-semibold "
            sortable
            expander
          ></Column>
          <Column
            field="status"
            header="Type"
            key="key"
            headerClassName="font-bold"
            bodyClassName="font-semibold capitalize "
          ></Column>
          <Column
            header="Photo"
            key="key"
            headerClassName="font-bold"
            body={photoBodyTemplate}
          ></Column>
        </TreeTable>
        <Toast ref={toast} />
      </div>
    </div>
  );
}

export default Categories;
