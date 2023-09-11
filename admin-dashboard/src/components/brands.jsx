import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import moment from "moment";
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
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { MultiSelect } from "primereact/multiselect";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

function Brands(props) {
    let brandForm = {
        name: "",    
        products: [],
      };
      const toast = useRef(null);
      const [brands, setBrands] = useState([]);
      const [brandDialog, setBrandDialog] = useState(false);
      const [products, setProducts] = useState(null);
      const [selectedProducts, setSelectedProducts] = useState(null);
      const [deleteBrandDialog, setDeleteBrandDialog] = useState(false);
      const [deleteBrandsDialog, setDeleteBrandsDialog] = useState(false);
      const [brand, setBrand] = useState(brandForm);
      const [selectedBrands, setSelectedBrands] = useState();
      const [submitted, setSubmitted] = useState(false);
      const [uploadedPhoto, setUploadedPhoto] = useState(null);
      const [globalFilterValue, setGlobalFilterValue] = useState("");
      const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
        },
        code: {
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
      code: {
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
  //
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
          onClick={() => setDeleteBrandsDialog(true)}
          disabled={!selectedBrands || !selectedBrands.length}
        />
      </div>
    );
  };
  const renderHeader = () => {
    return (
      <div className="flex justify-content-between ">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          size="small"
          onClick={clearFilter}
          className="sm:hidden"
          disabled={!globalFilterValue}
        />
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          size="small"
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
            className="p-inputtext-sm"
          />
        </span>
      </div>
    );
  };
  const header = renderHeader();
  
  const photoBodyTemplate = (element) => {
    return (
      <img src={element.photo} height={50} width={70} className="shadow-4" />
    );
  };
  
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex flex-row flex-nowrap justify-content-center">
        <i
          className="pi pi-pencil text-700 hover:text-primary   mr-3"
          onClick={() => editBrand(rowData)}
        ></i>
        <i
          className="pi pi-trash text-red-500 align-self-center hover:text-red-800"
          onClick={() => confirmDeleteBrand(rowData)}
        ></i>
      </div>
    );
  };
  //
  // #############################//...(2) CREATE/EDIT COUPON DIALOG ...\\##############################################

  //####################...(2-A) CREATE/EDIT FUNCTIONS ...#################
  const onFormChange = (e) => { 
    let name = e.target.name;
    let value = e.target.value;
    setBrand({ ...brand, [name]: value });
  };
  const editBrand = (brand) => {
    setSelectedProducts(brand.products);
    setBrand({ ...brand });
    setBrandDialog(true);
  };
  const openNew = () => {
    setSelectedProducts([]);
    setBrand(brandForm);
    setSubmitted(false);
    setBrandDialog(true);
  };
  const hideDialog = () => {
    setSubmitted(false);
    setUploadedPhoto(null);
    setBrandDialog(false);
  };
  const saveBrand = async () => {
    setSubmitted(true);
    if (brand._id) {
      // save edited brand
      let url = "http://localhost:3000/api/brands/edit/brand";
      try {
        let data = { ...brand, photo: uploadedPhoto };
        let res = await axios.postForm(url, data);
        if (res.data.success && res.data.brand) {
          let index = brands.findIndex((el) => el._id === brand._id);
          let _brands = [...brands];
          let _brand = res.data.brand;
          _brands[index] = _brand;
          setBrands(_brands);
          setSubmitted(false);
          setUploadedPhoto(null);
          setBrandDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `${_brand.name} brand updated`,
            life: 3000,
          });
        }
      } catch (error) {
        setSubmitted(false);
        setUploadedPhoto(null);
        setBrandDialog(false);
        toast.current.show({
          severity: "error",
          summary: "ERROR",
          detail: `${brand.name} brand update failed.`,
          life: 3000,
        });
      }
    } else {
      //---------------CREATE A NEW BRAND------------------
      let url = "http://localhost:3000/api/brands/new/brand";

      try {
        let data = { ...brand, photo: uploadedPhoto};
        let res = await axios.postForm(url, data);
        let newBrand = res.data.brand;
        let _brands = [...brands];
        if (res.data.success && res.data.brand) {
          _brands.push(newBrand);
          setBrands(_brands);
          setSubmitted(false);
          setBrand(brandForm);
          setUploadedPhoto(null);
          setBrandDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `${newBrand.name} brand created`,
            life: 3000,
          });
        }
      } catch (error) {
        setSubmitted(false);
        setUploadedPhoto(null);
        setBrandDialog(false);
        toast.current.show({
          severity: "error",
          summary: "ERROR",
          detail: `Create a new brand failed.`,
          life: 3000,
        });
      }
    }
  };
//####################...(2-B) CREATE/EDIT LAYOUT ...#####################
const productItemTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <img
          alt={option.name}
          src={option.photos[0]}
          className="mr-2"
          style={{ width: "18px" }}
        />
        <div>{option.name}</div>
      </div>
    );
  };

  const brandDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" type="submit" form="brandForm" />
    </React.Fragment>
  );

   //########################//...(3) DELETE ONE COUPON DIALOG..\\##################################

  //########################(3-A) DELETE ONE COUPON FUNCTIONS ###############################
  const confirmDeleteBrand = (brand) => {
    setBrand(brand);
    setDeleteBrandDialog(true);
  };
  const deleteBrand = async () => {
    try {
      let id = brand._id;
      let url = "http://localhost:3000/api/brands/delete/onebrand";
      let res = await axios.post(url, { id });
      if (res.data.success) {
        let _brands = brands.filter((val) => val._id !== brand._id);
        setBrands(_brands);
        setDeleteBrandDialog(false);
        setBrand(brandForm);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Brand Deleted",
          life: 3000,
        });
      }
    } catch (error) {
      setDeleteBrandDialog(false);
      setCoupon(couponForm);
      toast.current.show({
        severity: "error",
        summary: "ERROR",
        detail: "Can't delete brand!!",
        life: 3000,
      });
    }
  };
  //################### (3-B) DELETE ONE COUPON LAYOUT  ##########################################
  const deleteBrandDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={() => setDeleteBrandDialog(false)}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteBrand}
      />
    </React.Fragment>
  );
  // #########################//...(4) DELETE MANY COUPONS DIALOG ...\\\###############################

  //#######################(4-A) DELETE MANY COUPONS FUNCTIONS #####################################
  const deleteSelectedBrands = async () => {
    let ids = [];
    selectedBrands.map((brand) => ids.push(brand._id));
    try {
      let url = "http://localhost:3000/api/brands/delete/multiplebrands";
      let res = await axios.post(url, { ids });
      if (res.data.success) {
        let _brands = brands.filter((val) => !selectedBrands.includes(val));
        setBrands(_brands);
        setDeleteBrandsDialog(false);
        setSelectedBrands(null);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Brands Deleted",
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "danger",
          summary: "Failed",
          detail: "Cannot delete brands",
          life: 3000,
        });
        setDeleteBrandsDialog(false);
      }
    } catch (error) {
      setDeleteBrandsDialog(false);
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: "Cannot delete brands",
        life: 3000,
      });
    }
  };
  //################ (4-B) DELETE MANY COUPONS LAYOUT ############################
  const deleteBrandsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={() => setDeleteBrandsDialog(false)}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedBrands}
      />
    </React.Fragment>
  );
   //######## Getting Coupons && Products From DB ###########
   useEffect(() => {
    const getBrands = async () => {
      let url = "http://localhost:3000/api/brands/all";
      try {
        let res = await axios.get(url);
        setBrands(res.data.brands);
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
      let url = "http://localhost:3000/api/products/all";
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
    getBrands();
    getProducts();
  }, []);

    return (
        <div className="p-2 sm:p-3 card flex flex-column flex-wrap gap-3 align-items-center justify-content-center sm:flex-row">
        <Toolbar className="mb-4" left={toolbarTemplate}></Toolbar>
             <DataTable
        value={brands}
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
        selection={selectedBrands}
        onSelectionChange={(e) => setSelectedBrands(e.value)}
        header={header}
        className="w-full"
        breakpoint="968px"
        columnResizeMode="fit"
        size="small"
        responsiveLayout="stack"
      
      >
        <Column
          selectionMode="multiple"
          headerClassName="font-bold surface-200 "
          exportable={false}
          align="center"
        ></Column>
        <Column
          field="name"
          header="Name"
          headerClassName="font-bold surface-200 "
          bodyClassName="uppercase"
          sortable
        ></Column>
        <Column
          field="data.photo"
          header="Photo"
          headerClassName="font-bold surface-200"
          align="center"
          body={photoBodyTemplate}
        ></Column>
        <Column
          header="Actions"
          body={actionBodyTemplate}
          align="center"
          headerClassName="font-bold surface-200"
        ></Column>
      </DataTable>

      <Dialog
        visible={brandDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Brand Details"
        modal
        className="p-fluid"
        footer={brandDialogFooter}
        onHide={hideDialog}
      >
        {submitted ? (
          <div className="flex justify-content-center align-items-center">
            <ProgressSpinner />
          </div>
        ) : (
          <form id="brandForm" onSubmit={saveBrand}>
            {uploadedPhoto ? (
              <img
                src={URL.createObjectURL(uploadedPhoto)}
                alt=""
                width={200}
                className="coupon-image block m-auto pb-3"
              />
            ) : (
              <img
                src={brand.photo}
                alt={brand.photo}
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
                value={brand.name}
                onChange={(e) => onFormChange(e)}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !brand.name,
                })}
              />
              {submitted && !brand.name && (
                <small className="p-error">Name is required.</small>
              )}
            </div>
            <div className="formgrid grid">
                <div className="field col max-w-full">
                  <label htmlFor="products" className="font-bold">
                    Products
                  </label>
                  <MultiSelect
                    value={brand.products}
                    onChange={(e) => {
                      onFormChange(e);
                    }}
                    options={products}
                    name="products"
                    dataKey="_id"
                    key="name"
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
        visible={deleteBrandDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteBrandDialogFooter}
        onHide={() => setDeleteBrandDialog(false)}
      >
        <div className="confirmation-content flex ">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {brand && (
            <span className="align-self-center">
              Are you sure you want to delete <p className="uppercase">{brand.name}</p>?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={deleteBrandsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteBrandsDialogFooter}
        onHide={() => setDeleteBrandsDialog(false)}
      >
        <div className="confirmation-content flex">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          <span className="align-self-center">
            Are you sure you want to delete the selected brands?
          </span>
        </div>
        {selectedBrands && (
          <div className="flex-wrap flex flex-row py-2  justify-content-center">
            {selectedBrands.map((element) => {
              return (
                <div className="border-round-3xl bg-primary p-2 w-max m-1 uppercase">
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

export default Brands;