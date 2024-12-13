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
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Rating } from "primereact/rating";
import { TreeTable } from "primereact/treetable";
import { MultiSelect } from "primereact/multiselect";
import createCategoriesNodes from "./useCreateCategoriesNodes";
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
  const categoryForm = {
    name: "",
    photo: "",
    subCategories: [],
    products: [],
  };
  const subCategoryForm = {
    name: "",
    photo: "",
    description: "",
    category: null,
    products: [],
  };
  const [nodes, setNodes] = useState([]);
  const toast = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(categoryForm);
  const [subCategory, setSubCategory] = useState(subCategoryForm);
  const [subCategoryDialog, setSubCategoryDialog] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [photoError, setPhotoError] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
  const [deleteSubCategoryDialog, setDeleteSubCategoryDialog] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });
  //################################# CATEGORY#############################
  const onCategoryFormChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setCategory({ ...category, [name]: value });
  };
  const saveCategory = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (category._id) {
      // save edited category
      let url = "https://shady-business-server.onrender.com/api/categories/edit/category";
      try {
        let data = { ...category, photo: uploadedPhoto };
        let res = await axios.postForm(url, data);
        if (res.data.success && res.data.category) {
          let index = categories.findIndex((el) => el._id === category._id);
          let _categories = [...categories];
          let _category = res.data.category;
          _categories[index] = _category;
          setCategories(_categories);
          setSubmitted(false);
          setUploadedPhoto(null);
          setCategoryDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `${_category.name} category updated`,
            life: 3000,
          });
        }
      } catch (error) {
        setSubmitted(false);
        setUploadedPhoto(null);
        setCategoryDialog(false);
        toast.current.show({
          severity: "error",
          summary: "ERROR",
          detail: `${category.name} category update failed.`,
          life: 3000,
        });
      }
    } else {
      // create new category
      if (!uploadedPhoto) {
        setPhotoError(true);
        setSubmitted(false);
        const div = () => document.getElementById("categoryForm");
        div().scrollIntoView();
        return;
      } else {
        setPhotoError(false);
      }
      let url = "https://shady-business-server.onrender.com/api/categories/addCategory";

      try {
        let data = { ...category, photo: uploadedPhoto };
        let res = await axios.postForm(url, data);
        let newCategory = res.data.category;
        let _categories = [...categories];
        if (res.data.success && res.data.category) {
          _categories.push(newCategory);
          setCategories(_categories);
          setSubmitted(false);
          setCategory(categoryForm);
          setUploadedPhoto(null);
          setCategoryDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `${newCategory.name} category created`,
            life: 3000,
          });
        }
      } catch (error) {
        setSubmitted(false);
        setUploadedPhoto(null);
        setCategoryDialog(false);
        toast.current.show({
          severity: "error",
          summary: "ERROR",
          detail: `Create a new category failed.`,
          life: 3000,
        });
      }
    }
  };
  const confirmDeleteCategory = (category) => {
    setCategory(category.data);
    setDeleteCategoryDialog(true);
  };
  const deleteCategory = async () => {
    try {
      let url = "https://shady-business-server.onrender.com/api/categories/delete/category";
      let res = await axios.post(url, category);
      if (res.data.success) {
        let _categories = categories.filter((val) => val._id !== category._id);
        setCategories(_categories);
        setDeleteCategoryDialog(false);
        setCategory(categoryForm);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: `Category ${category.name} Deleted`,
          life: 3000,
        });
      }
    } catch (error) {
      setDeleteCategoryDialog(false);
      setCategory(categoryForm);
      toast.current.show({
        severity: "error",
        summary: "ERROR",
        detail: "Can't delete category!!",
        life: 3000,
      });
    }
  };

  //################################ SUB-CATEGORY#########################
  const onSubCategoryFormChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setSubCategory({ ...subCategory, [name]: value });
  };
  const saveSubCategory = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (subCategory._id) {
      // save edited sub-category
      let url = "https://shady-business-server.onrender.com/api/subCategories/edit/subCategory";
      try {
        let data = { ...subCategory, photo: uploadedPhoto };
        let res = await axios.postForm(url, data);
        if (res.data.success && res.data.subCategory) {
          let _subCategory = res.data.subCategory;
          let categoryIndex = categories.findIndex(
            (el) => el._id === _subCategory.category._id
          );
          let subIndex = categories[categoryIndex].sub_categories.findIndex(
            (el) => el._id === _subCategory._id
          );
          let _categories = [...categories];
          _categories[categoryIndex].sub_categories[subIndex] = _subCategory;
          setCategories(_categories);
          setSubmitted(false);
          setUploadedPhoto(null);
          setSubCategoryDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `${_subCategory.name} sub-category updated`,
            life: 3000,
          });
        }
      } catch (error) {
        setSubmitted(false);
        setUploadedPhoto(null);
        setCategoryDialog(false);
        toast.current.show({
          severity: "error",
          summary: "ERROR",
          detail: `${subCategory.name} sub-category update failed.`,
          life: 3000,
        });
      }
    } else {
      if (!uploadedPhoto) {
        setPhotoError(true);
        setSubmitted(false);
        const div = () => document.getElementById("subCategoryForm");
        div().scrollIntoView();
        return;
      } else {
        setPhotoError(false);
      }
      // create new sub-category
      let url = "https://shady-business-server.onrender.com/api/subCategories/add/subCategory";
      try {
        let data = { ...subCategory, photo: uploadedPhoto };
        let res = await axios.postForm(url, data);
        if (res.data.success && res.data.subCategory) {
          let newSubCategory = res.data.subCategory;
          let categoryIndex = categories.findIndex(
            (el) => el._id === newSubCategory.category._id
          );
          let _categories = [...categories];
          _categories[categoryIndex].sub_categories.push(newSubCategory);
          setCategories(_categories);
          setSubmitted(false);
          setSubCategory(subCategoryForm);
          setUploadedPhoto(null);
          setSubCategoryDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `${newSubCategory.name} sub-category created`,
            life: 3000,
          });
        }
      } catch (error) {
        setSubmitted(false);
        setUploadedPhoto(null);
        setSubCategoryDialog(false);
        toast.current.show({
          severity: "error",
          summary: "ERROR",
          detail: `Create a new sub-category failed.`,
          life: 3000,
        });
      }
    }
  };
  const confirmDeleteSubCategory = (sub) => {
    setSubCategory(sub.data);
    setDeleteSubCategoryDialog(true);
  };
  const deleteSubCategory = async () => {
    try {
      let url = "https://shady-business-server.onrender.com/api/subCategories/delete/subCategory";
      let res = await axios.post(url, subCategory);
      if (res.data.success) {
        let categoryIndex = categories.findIndex(
          (cat) => cat._id === subCategory.category._id
        );
        let subs = [];
        let _categories = [...categories];
        _categories[categoryIndex].sub_categories.map((sub) => {
          if (sub._id !== subCategory._id) {
            subs.push(sub);
          }
        });
        _categories[categoryIndex].sub_categories = subs;
        setCategories(_categories);
        setDeleteSubCategoryDialog(false);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: `Sub-Category ${subCategory.name} Deleted`,
          life: 3000,
        });
        setSubCategory(subCategoryForm);
      }
    } catch (error) {
      setDeleteSubCategoryDialog(false);
      setSubCategory(subCategoryForm);
      toast.current.show({
        severity: "error",
        summary: "ERROR",
        detail: "Can't delete sub-category!!",
        life: 3000,
      });
    }
  };
  //################### (3-B) DELETE ONE PRODUCT LAYOUT  ##########################################
  const deleteCategoryDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={() => setDeleteCategoryDialog(false)}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={() => deleteCategory(category.data)}
      />
    </React.Fragment>
  );
  const deleteSubCategoryDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={() => setDeleteSubCategoryDialog(false)}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={() => deleteSubCategory(subCategory.data)}
      />
    </React.Fragment>
  );
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
          label="Category"
          tooltip="create a new category"
          icon="pi pi-plus"
          severity="success"
          onClick={openNewCategory}
        />
        <Button
          label="Subcategory"
          icon="pi pi-plus"
          severity="success"
          onClick={openNewSubCategory}
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

  const typeBodyTemplate = (node) => {
    let severity =
      node.data.status === "category"
        ? "info"
        : node.data.status === "subCategory"
        ? "warning"
        : node.key.slice(-1) === "*"
        ? "primary"
        : "success";
    return (
      <Tag
        value={node.data.status}
        severity={severity}
        className="text-sm p-2 px-3"
      ></Tag>
    );
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex flex-row flex-nowrap justify-content-center">
        <Button
          icon="pi pi-pencil"
          rounded
          severity="info"
          size="small"
          className="mr-2"
          onClick={() => editRow(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          size="small"
          severity="danger"
          onClick={() => confirmDeleteRow(rowData)}
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
  const openNewCategory = () => {
    setUploadedPhoto(null);
    setPhotoError(false);
    setCategory(categoryForm);
    setSubmitted(false);
    setCategoryDialog(true);
  };
  const openNewSubCategory = () => {
    setUploadedPhoto(null);
    setPhotoError(false);
    setSubCategory(subCategoryForm);
    setSubmitted(false);
    setSubCategoryDialog(true);
  };
  const editRow = (node) => {
    if (node.data.status === "category") {
      editCategory(node);
    }
    if (node.data.status === "subCategory") {
      editSubCategory(node);
    }
  };
  const editCategory = (category) => {
    setCategory(category.data);
    setCategoryDialog(true);
  };
  const editSubCategory = (sub) => {
    setSubCategory(sub.data);
    setSubCategoryDialog(true);
  };

  const confirmDeleteRow = (node) => {
    if (node.data.status === "category") {
      confirmDeleteCategory(node);
    }
    if (node.data.status === "subCategory") {
      confirmDeleteSubCategory(node);
    }
  };

  const hideDialog = () => {
    setSubmitted(false);
    setPhotoError(false);
    setCategoryDialog(false);
    setSubCategoryDialog(false);
    setUploadedPhoto(null);
    setProductDialog(false);
    setPhotoError(false);
  };

  const categoryDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button
        label="Save"
        icon="pi pi-check"
        type="submit"
        form="categoryForm"
      />
    </React.Fragment>
  );
  const subCategoryDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button
        label="Save"
        icon="pi pi-check"
        type="submit"
        form="subCategoryForm"
      />
    </React.Fragment>
  );

  //######## Get Data From DB ###########
  useEffect(() => {
    const getCategories = async () => {
      let url = "https://shady-business-server.onrender.com/api/categories/all";
      try {
        let res = await axios.get(url);
        if (res.data.allCategories) {
          setCategories(res.data.allCategories);
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
    const getProducts = async () => {
      let url = "https://shady-business-server.onrender.com/api/products/all";
      try {
        let res = await axios.get(url);
        setProducts(res.data.products);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "SERVER ERROR",
          detail: "Internal error occured, please try again.",
          life: 3000,
        });
      }
    };
    const getSubCategories = async () => {
      let url = "https://shady-business-server.onrender.com/api/subCategories/all";
      try {
        let res = await axios.get(url);
        if (res.data.subCategories) {
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
    getProducts();
  }, []);
  useEffect(() => {
    let _nodes = createCategoriesNodes(categories);
    setNodes(_nodes);
  }, [categories]);
  return (
    <div className="p-2 sm:p-3 card flex flex-column flex-wrap gap-3 align-items-center justify-content-center sm:flex-row bg-white border-round-lg shadow-2">
      <div className="p-2 sm:p-3 card flex flex-column flex-wrap gap-3 align-items-center justify-content-center sm:flex-row ">
        <Toolbar className="mb-4" left={toolbarTemplate}></Toolbar>
        <TreeTable
          value={nodes}
          key="key"
          size="small"
          showGridlines
          stripedRows
          removableSort
          selectionMode="single"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          onSelectionChange={(e) =>{}}
          onSelect={(e) => {
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
            body={typeBodyTemplate}
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
          <Column
            header="Actions"
            key="key"
            headerClassName="font-bold"
            body={actionBodyTemplate}
          ></Column>
        </TreeTable>
        <Dialog
          visible={categoryDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="category Details"
          modal
          className="p-fluid"
          footer={categoryDialogFooter}
          onHide={hideDialog}
        >
          {submitted ? (
            <div className="flex justify-content-center align-items-center">
              <ProgressSpinner />
            </div>
          ) : (
            <form id="categoryForm" onSubmit={saveCategory}>
              {photoError && (
                <div
                  id="photoError"
                  className="card shadow-4 w-full p-1 text-center mb-2 border-round-lg bg-red-500"
                >
                  <p className="font-bold text-50">
                    Category photo required, Please upload one.
                  </p>
                </div>
              )}
              {uploadedPhoto ? (
                <img
                  src={URL.createObjectURL(uploadedPhoto)}
                  alt=""
                  width={200}
                  className="coupon-image block m-auto pb-3"
                />
              ) : (
                <img
                  src={category.photo}
                  alt={category.photo}
                  width={200}
                  className="coupon-image block m-auto pb-3"
                />
              )}
              <div className="flex flex-row justify-content-center">
                <div className="image-upload">
                  <label htmlFor="file-input">
                    <i className="pi pi-plus bg-primary border-round-3xl p-3 mr-2 cursor-pointer">
                      <span className="font-semi-bold"> Upload</span>
                    </i>
                  </label>

                  <input
                    id="file-input"
                    type="file"
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                    onChange={(e) => setUploadedPhoto(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </div>
                {uploadedPhoto && (
                  <i
                    className="pi pi-times bg-primary border-round-3xl p-3 mr-2 cursor-pointer"
                    onClick={() => setUploadedPhoto(null)}
                  >
                    <span className="font-semi-bold"> Cancel</span>
                  </i>
                )}
              </div>

              <div className="field">
                <label htmlFor="name" className="font-bold">
                  Name
                </label>
                <InputText
                  id="name"
                  name="name"
                  value={category.name}
                  onChange={(e) => onCategoryFormChange(e)}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !category.name,
                  })}
                />
                {submitted && !category.name && (
                  <small className="p-error">Name is required.</small>
                )}
              </div>
              <div className="field">
                <label className="mb-3 font-bold">Sub-Category</label>
                <MultiSelect
                  value={category.subCategories}
                  name="subCategories"
                  onChange={(e) => onCategoryFormChange(e)}
                  options={subCategories}
                  filter
                  display="chip"
                  optionLabel="name"
                  dataKey="_id"
                  placeholder="choose sub-category"
                  className="capitalize"
                  required={true}
                />
              </div>
              <div className="formgrid grid">
                <div className="field col max-w-full">
                  <label htmlFor="products" className="font-bold">
                    Products
                  </label>
                  <MultiSelect
                    value={category.products}
                    onChange={(e) => {
                      onCategoryFormChange(e);
                    }}
                    options={products}
                    name="products"
                    dataKey="name"
                    optionLabel="name"
                    display="chip"
                    filter
                    placeholder="Select products"
                    maxSelectedLabels={50}
                    className="max-w-full		"
                  />
                </div>
              </div>
            </form>
          )}
        </Dialog>
        <Dialog
          visible={subCategoryDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Sub-Category Details"
          modal
          className="p-fluid"
          footer={subCategoryDialogFooter}
          onHide={hideDialog}
        >
          {submitted ? (
            <div className="flex justify-content-center align-items-center">
              <ProgressSpinner />
            </div>
          ) : (
            <form id="subCategoryForm" onSubmit={saveSubCategory}>
              {photoError && (
                <div
                  id="photoError"
                  className="card shadow-4 w-full p-1 text-center mb-2 border-round-lg bg-red-500"
                >
                  <p className="font-bold text-50">
                    Sub-Category's photo required, Please upload one.
                  </p>
                </div>
              )}
              {uploadedPhoto ? (
                <img
                  src={URL.createObjectURL(uploadedPhoto)}
                  alt=""
                  width={200}
                  className="coupon-image block m-auto pb-3"
                />
              ) : (
                <img
                  src={subCategory.photo}
                  alt={subCategory.photo}
                  width={200}
                  className="coupon-image block m-auto pb-3"
                />
              )}
              <div className="flex flex-row justify-content-center">
                <div className="image-upload">
                  <label htmlFor="file-input">
                    <i className="pi pi-plus bg-primary border-round-3xl p-3 mr-2 cursor-pointer">
                      <span className="font-semi-bold"> Upload</span>
                    </i>
                  </label>

                  <input
                    id="file-input"
                    type="file"
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                    onChange={(e) => setUploadedPhoto(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </div>
                {uploadedPhoto && (
                  <i
                    className="pi pi-times bg-primary border-round-3xl p-3 mr-2 cursor-pointer"
                    onClick={() => setUploadedPhoto(null)}
                  >
                    <span className="font-semi-bold"> Cancel</span>
                  </i>
                )}
              </div>
              <div className="field ">
                <label htmlFor="name" className="font-bold">
                  Name
                </label>
                <InputText
                  id="name"
                  name="name"
                  value={subCategory.name}
                  onChange={(e) => onSubCategoryFormChange(e)}
                  required
                  autoFocus
                  className="p-inputtext-sm"
                />
                {submitted && !category.name && (
                  <small className="p-error">Name is required.</small>
                )}
              </div>
              <div className="field">
                <label htmlFor="description" className="font-bold">
                  Description
                </label>
                <InputTextarea
                  id="description"
                  name="description"
                  value={subCategory.description}
                  onChange={(e) => onSubCategoryFormChange(e)}
                  required
                  rows={3}
                  cols={20}
                />
              </div>
              <div className="field">
                <label className="mb-3 font-bold">Category</label>
                <Dropdown
                  value={subCategory.category}
                  name="category"
                  onChange={(e) => onSubCategoryFormChange(e)}
                  options={categories}
                  optionLabel="name"
                  dataKey="_id"
                  placeholder="choose a type.."
                  className="capitalize"
                  required={true}
                />
              </div>

              <div className="formgrid grid">
                <div className="field col max-w-full">
                  <label htmlFor="products" className="font-bold">
                    Products
                  </label>
                  <MultiSelect
                    value={subCategory.products}
                    onChange={(e) => {
                      onSubCategoryFormChange(e);
                    }}
                    options={products}
                    name="products"
                    dataKey="name"
                    optionLabel="name"
                    display="chip"
                    filter
                    placeholder="Select products"
                    maxSelectedLabels={50}
                    className="max-w-full		"
                  />
                </div>
              </div>
            </form>
          )}
        </Dialog>
        <Dialog
          visible={deleteCategoryDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={deleteCategoryDialogFooter}
          onHide={() => setDeleteCategoryDialog(false)}
        >
          <div className="confirmation-content flex ">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {category && (
              <span className="align-self-center">
                Are you sure you want to delete <b>{category.name}</b>?
              </span>
            )}
          </div>
        </Dialog>
        <Dialog
          visible={deleteSubCategoryDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={deleteSubCategoryDialogFooter}
          onHide={() => setDeleteSubCategoryDialog(false)}
        >
          <div className="confirmation-content flex ">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {subCategory && (
              <span className="align-self-center">
                Are you sure you want to delete <b>{subCategory.name}</b>?
              </span>
            )}
          </div>
        </Dialog>
        <Toast ref={toast} />
      </div>
    </div>
  );
}

export default Categories;
