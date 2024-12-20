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

function Products(props) {
  let productForm = {
    name: "",
    price: null,
    retail_price: null,
    stock: 0,
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
  const toast = useRef(null);
  const [product, setProduct] = useState(productForm);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState(null);
  const [photoError, setPhotoError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    category: {
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
      category: {
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
          onClick={() => setDeleteProductsDialog(true)}
          disabled={!selectedProducts || !selectedProducts.length}
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
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          size="small"
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </div>
    );
  };
  const ratingBodyTemplate = (rowData) => {
    return (
      <div className="flex flex-row align-items-center gap-2">
        <Rating value={rowData.rating} readOnly cancel={false} />
        <span className="text-primary text-sm">
          ({rowData.rating.toFixed(2)})
        </span>
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
    setPhotos([])
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
      const div =()=> document.getElementById('productForm')
       div().scrollIntoView()
      return;
    } else {
      setPhotoError(false);
    }
    setSubmitted(true);
    if (product._id) {
      // save edited product
      let url = "https://shady-business-server.onrender.com/api/products/edit/product";
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
      let url = "https://shady-business-server.onrender.com/api/products/addProduct";
      try {
        let data = { ...product, FileList: files };
        let res = await axios.postForm(url, data);
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
            detail: `${newProduct.name} product created`,
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

  useEffect(() => {
    if (files.length > 0) {
      let urls = files.map((file) => file.objectURL);
      setPhotos([...product.photos, ...urls]);
    } else {
      setPhotos(product.photos);
    }
  }, [files]);
  //####################...(2-B) CREATE/EDIT LAYOUT ...#####################
  const itemTemplate = (file, props) => {
    let unit = props.formatSize.slice(-2);
    let size = props.formatSize.slice(0, -2);
    size = Number(size).toFixed(1);
    let key = Date.now;
    return (
      <div
        className="flex flex-column align-items-start justify-content-between"
        style={{ height: "200px" }}
        key={key}
      >
        <div
          className="flex flex-column align-items-center justify-content-between "
          style={{ width: "100px" }}
        >
          <div className="relative">
            <img
              alt=""
              role="presentation"
              src={file.objectURL}
              width={100}
              height={100}
              className="w-full shadow-4 "
            />
            <span className="flex  text-left  text-overflow-ellipsis">
              {file.name}
            </span>
            <Badge
              value={"X"}
              severity="danger"
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                cursor: "pointer",
              }}
              onClick={() => onTemplateRemove(file, props.onRemove)}
            ></Badge>
          </div>
        </div>
        <Tag
          value={size + " " + unit}
          severity="warning"
          className="px-3 py-1 "
        />
      </div>
    );
  };
  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-0 p-1 sm:p-3 md:p-5"
          style={{
            fontSize: "2em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1em", color: "var(--text-color-secondary)" }}
          className="my-3"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded ",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className: " p-button-danger p-button-rounded ",
  };
  const onTemplateClear = () => {};
  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;

    return (
      <div
        className={`${className} flex justify-content-between`}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        ADD PHOTO
        <div>
          {chooseButton}
          {cancelButton}
        </div>
      </div>
    );
  };
  const carouselBodyTemplate = (image) => {
    return (
      <div className="text-center">
        <img src={image} alt={image}  className='w-7rem sm:w-11rem' />
      </div>
    );
  };

  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button
        label="Save"
        icon="pi pi-check"
        type="submit"
        form="productForm"
      />
    </React.Fragment>
  );

  //########################//...(3) DELETE ONE PRODUCT DIALOG..\\##################################

  //########################(3-A) DELETE ONE PRODUCT FUNCTIONS ###############################
  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };
  const deleteProduct = async (product) => {
    try {
      let name = product.name;
      let id = product._id;
      let photos = product.photos;
      let url = "https://shady-business-server.onrender.com/api/products/remove/product";
      let res = await axios.post(url, { id, photos });
      if (res.data.success) {
        let _products = products.filter((val) => val._id !== product._id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(productForm);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: `Product ${name} Deleted`,
          life: 3000,
        });
      }
    } catch (error) {
      setDeleteProductDialog(false);
      setProduct(productForm);
      toast.current.show({
        severity: "error",
        summary: "ERROR",
        detail: "Can't delete product!!",
        life: 3000,
      });
    }
  };
  //################### (3-B) DELETE ONE PRODUCT LAYOUT  ##########################################
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={() => setDeleteProductDialog(false)}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={() => deleteProduct(product)}
      />
    </React.Fragment>
  );
  // #########################//...(4) DELETE MANY PRODUCTS DIALOG ...\\\###############################

  //#######################(4-A) DELETE MANY PRODUCTS FUNCTIONS #####################################
  const deleteSelectedProducts = async () => {
    try {
      selectedProducts.map((product) => deleteProduct(product));
      setDeleteProductsDialog(false);
      setSelectedProducts(null);
    } catch (error) {
      setDeleteProductsDialog(false);
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: "Cannot delete products",
        life: 3000,
      });
    }
  };
  //################ (4-B) DELETE MANY PRODUCTS LAYOUT ############################
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={() => setDeleteProductsDialog(false)}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );
  //######## Get Data From DB ###########
  useEffect(() => {
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

    getProducts();
    getCategories();
    getSubCategories();
  }, []);
 
  return (
    <div className="p-2 sm:p-3 card flex flex-column flex-wrap gap-3 align-items-center justify-content-center sm:flex-row bg-white border-round-lg shadow-2">
      <Toolbar className="mb-4" left={toolbarTemplate}></Toolbar>
      <DataTable
        value={products}
        showGridlines
        stripedRows
        removableSort
        dataKey="_id"
        scrollable
        scrollHeight="400px"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25]}
        filters={filters}
        globalFilterFields={["name", "code"]}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        header={header}
        className="w-full"
        breakpoint="968px"
        columnResizeMode="fit"
        size="small"
        responsiveLayout="stack"
      >
        <Column
          selectionMode="multiple"
          exportable={false}
          align="center"
        ></Column>
        <Column
          field="name"
          header="Name"
          sortable
          headerClassName="font-bold "
        ></Column>
        <Column
          field="category.name"
          header="Category"
          sortable
          headerClassName="font-bold "
        ></Column>
        <Column
          field="subCategory.name"
          header="Sub_Category"
          sortable
          headerClassName="font-bold "
        ></Column>
        <Column
          field="total_stock"
          header="Stock"
          sortable
          headerClassName="font-bold "
        ></Column>

        <Column
          field="price"
          header="Price"
          sortable
          headerClassName="font-bold "
        ></Column>
        <Column
          field="rating"
          header="Raing"
          body={ratingBodyTemplate}
          sortable
          headerClassName="font-bold "
        ></Column>

        <Column
          header="Actions"
          body={actionBodyTemplate}
          alignHeader="center"
          headerClassName="font-bold "
        ></Column>
      </DataTable>
      <Dialog
        visible={productDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Product Details"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        {submitted ? (
          <div className="flex justify-content-center align-items-center">
            <ProgressSpinner />
          </div>
        ) : (
          <form id="productForm" onSubmit={saveProduct}>
            {photoError && (
              <div
                id="photoError"
                className="card shadow-4 w-full p-1 text-center mb-2 border-round-lg bg-red-500"
              >
                <p className="font-bold text-50">Product photo required, Please upload one.</p>
              </div>
              
            )}
            <Carousel
              value={photos}
              itemTemplate={carouselBodyTemplate}
              circular={photos.length > 1}
              showIndicators={photos.length > 1}
              showNavigators={photos.length > 1}
            />

            <div className="field">
              <label htmlFor="name" className="font-bold">
                Name
              </label>
              <InputText
                id="name"
                name="name"
                value={product.name}
                onChange={(e) => onFormChange(e)}
                autoFocus
                required
                className={classNames({
                  "p-invalid": submitted && product.name === "",
                })}
              />
              {submitted && !product.name && (
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
                value={product.description}
                onChange={(e) => onFormChange(e)}
                required
                rows={3}
                cols={20}
              />
            </div>

            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="price" className="font-bold">
                  Price
                </label>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon bg-primary">$</span>
                  <InputNumber
                    id="price"
                    name="price"
                    maxFractionDigits={2}
                    value={product.price}
                    onValueChange={(e) => onFormChange(e)}
                    placeholder="Price"
                    required
                  />
                </div>
              </div>
              <div className="field col">
                <label htmlFor="retail" className="font-bold">
                  Stock Price
                </label>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon bg-primary">$</span>
                  <InputNumber
                    id="retail"
                    name="retail"
                    maxFractionDigits={2}
                    value={product.retail_price}
                    onValueChange={(e) => onFormChange(e)}
                    placeholder="Stock Price"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="field">
              <label htmlFor="stock" className="mb-3 font-bold">
                Unit count
              </label>
              <InputNumber
                    id="stock"
                    name="stock"
                    value={product.stock}
                    onValueChange={(e) => onFormChange(e)}
                    placeholder="0"
                    required
                  />
            </div>
            <div className="field">
              <label htmlFor="category" className="mb-3 font-bold">
                Category
              </label>
              <Dropdown
                id="category"
                value={product.category}
                name="category"
                onChange={(e) => onFormChange(e)}
                options={categories}
                optionLabel="name"
                dataKey="_id"
                placeholder="choose category.."
                required={true}
              />
            </div>
            <div className="field">
              <label htmlFor="subcategory" className="mb-3 font-bold">
                Sub_Category
              </label>
              <Dropdown
                id="subcategory"
                value={product.subCategory}
                name="subCategory"
                onChange={(e) => onFormChange(e)}
                options={subCategories}
                optionLabel="name"
                dataKey="_id"
                placeholder="choose sub_category.."
              />
            </div>
            <div className="upload my-2">
              <Tooltip
                target=".custom-choose-btn"
                content="Choose"
                position="bottom"
              />
              <Tooltip
                target=".custom-cancel-btn"
                content="Clear"
                position="bottom"
              />
              <FileUpload
                name="demo[]"
                url="/api/upload"
                multiple
                accept="image/*"
                maxFileSize={1000000}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                cancelOptions={cancelOptions}
              />
            </div>
          </form>
        )}
      </Dialog>
      <Dialog
        visible={deleteProductDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductDialogFooter}
        onHide={() => setDeleteProductDialog(false)}
      >
        <div className="confirmation-content flex ">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span className="align-self-center">
              Are you sure you want to delete <b>{product.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={deleteProductsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductsDialogFooter}
        onHide={() => setDeleteProductsDialog(false)}
      >
        <div className="confirmation-content flex">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          <span className="align-self-center">
            Are you sure you want to delete the selected products?
          </span>
        </div>
        {selectedProducts && (
          <div className="flex-wrap flex flex-row py-2  justify-content-center">
            {selectedProducts.map((element) => {
              return (
                <div className="border-round-3xl bg-primary p-2 w-max m-1">
                  {element.name}
                </div>
              );
            })}
          </div>
        )}
      </Dialog>
      <Toast ref={toast} />
    </div>
  );
}

export default Products;
