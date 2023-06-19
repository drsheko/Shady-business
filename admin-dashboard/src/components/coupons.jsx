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
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { MultiSelect } from "primereact/multiselect";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

function Coupons(props) {
  let couponForm = {
    name: "",
    description: "",
    code: "",
    type: "",
    automated: false,
    active: false,
    startDate: null,
    expireDate: null,
    minimumPurchase: 0, // negative value for NO MINIUM
    maximumPurchase: 0, // negative value for NO MAXIMUM
    products: [],
    userMaxRedeem: 1,
    percentageOff: null,
    amountOff: null,
    freeGift: null,
    giftCount: null,
  };
  const toast = useRef(null);
  const [coupons, setCoupons] = useState([]);
  const [couponDialog, setCouponDialog] = useState(false);
  const [products, setProducts] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [deleteCouponDialog, setDeleteCouponDialog] = useState(false);
  const [deleteCouponsDialog, setDeleteCouponsDialog] = useState(false);
  const [coupon, setCoupon] = useState(couponForm);
  const [selectedCoupons, setSelectedCoupons] = useState();
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
          onClick={() => setDeleteCouponsDialog(true)}
          disabled={!selectedCoupons || !selectedCoupons.length}
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

  const photoBodyTemplate = (element) => {
    return (
      <img src={element.photo} height={50} width={70} className="shadow-4" />
    );
  };
  const activeBodyTemplate = (element) => {
    if (element.active) {
      return (
        <div className="text-center">
          <i className="pi pi-check p-1 text-base border-circle bg-green-500 text-0"></i>
        </div>
      );
    } else {
      return (
        <div className="text-center">
          <i className="pi pi-times p-1 text-base border-circle bg-red-500 text-0"></i>
        </div>
      );
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          className="mr-2"
          onClick={() => editCoupon(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          severity="danger"
          onClick={() => confirmDeleteCoupon(rowData)}
        />
      </React.Fragment>
    );
  };

  // #############################//...(2) CREATE/EDIT COUPON DIALOG ...\\##############################################

  //####################...(2-A) CREATE/EDIT FUNCTIONS ...#################
  const onFormChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    /*if(name ==='products'){
        let _value =e.target.value 
        value =_value.map(val => val._id)
    }else if(name==='freeGift'){
        value = e.target.value._id
    }else{
        value = e.target.value;
    }*/
    setCoupon({ ...coupon, [name]: value });
    console.log(value);
    console.log(name)
    console.log(coupon)
  };
  const editCoupon = (coupon) => {
    setCoupon({ ...coupon });
    console.log('edit ', coupon.products)
     setSelectedProducts(coupon.products)
    setCouponDialog(true);
  };
  const openNew = () => {
    setCoupon(couponForm);
    setSubmitted(false);
    setCouponDialog(true);
  };
  const hideDialog = () => {
    setSubmitted(false);
    setUploadedPhoto(null);
    setSelectedProducts(null);
    setCouponDialog(false);
  };
  const saveCoupon = async () => {
    setSubmitted(true);
    if (coupon._id) {
      // save edited coupon
      let url = "http://localhost:3000/api/coupons/edit/coupon";
      try {
        let data = { ...coupon, photo: uploadedPhoto };
        let res = await axios.postForm(url, data);
        if (res.data.success && res.data.coupon) {
          let index = coupons.findIndex((el) => el._id === coupon._id);
          console.log(res.data.coupon, index);
          let _coupons = [...coupons];
          let _coupon = res.data.coupon;
          _coupons[index] = _coupon;
          setCoupons(_coupons);
          setSubmitted(false);
          setUploadedPhoto(null);
          setCouponDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `${_coupon.name} coupon updated`,
            life: 3000,
          });
        }
      } catch (error) {
        setSubmitted(false);
        setUploadedPhoto(null);
        setCouponDialog(false);
        toast.current.show({
          severity: "error",
          summary: "ERROR",
          detail: `${coupon.name} coupon update failed.`,
          life: 3000,
        });
      }
    } else {
      //---------------CREATE A NEW COUPON------------------
      let url = "http://localhost:3000/api/coupons/new/coupon";

      try {
        let data = { ...coupon, photo: uploadedPhoto };
        let res = await axios.postForm(url, data);
        let newCoupon = res.data.coupon;
        let _coupons = [...coupons];
        if (res.data.success && res.data.coupon) {
          _coupons.push(newCoupon);
          setCoupons(_coupons);
          setSubmitted(false);
          setCoupon(couponForm);
          setUploadedPhoto(null);
          setCouponDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `${newCoupon.name} coupon created`,
            life: 3000,
          });
        }
      } catch (error) {
        console.log(error);
        setSubmitted(false);
        setUploadedPhoto(null);
        setCouponDialog(false);
        toast.current.show({
          severity: "error",
          summary: "ERROR",
          detail: `Create a new coupon failed.`,
          life: 3000,
        });
      }
    }
  };
  //####################...(2-B) CREATE/EDIT LAYOUT ...#####################
  const couponDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" type="submit" form="couponForm" />
    </React.Fragment>
  );

  //########################//...(3) DELETE ONE COUPON DIALOG..\\##################################

  //########################(3-A) DELETE ONE COUPON FUNCTIONS ###############################
  const confirmDeleteCoupon = (coupon) => {
    setCoupon(coupon);
    setDeleteCouponDialog(true);
  };
  const deleteCoupon = async () => {
    try {
      let id = coupon._id;
      let url = "http://localhost:3000/api/coupons/remove/coupon";
      let res = await axios.post(url, { id });
      console.log(res.data);
      if (res.data.success) {
        let _coupons = coupons.filter((val) => val._id !== coupon._id);
        setCoupons(_coupons);
        setDeleteCouponDialog(false);
        setCoupon(couponForm);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Coupon Deleted",
          life: 3000,
        });
      }
    } catch (error) {
      setDeleteCouponDialog(false);
      setCoupon(couponForm);
      toast.current.show({
        severity: "error",
        summary: "ERROR",
        detail: "Can't delete coupon!!",
        life: 3000,
      });
      console.log(error);
    }
  };
  //################### (3-B) DELETE ONE COUPON LAYOUT  ##########################################
  const deleteCouponDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={() => setDeleteCouponDialog(false)}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteCoupon}
      />
    </React.Fragment>
  );
  // #########################//...(4) DELETE MANY COUPONS DIALOG ...\\\###############################

  //#######################(4-A) DELETE MANY COUPONS FUNCTIONS #####################################
  const deleteSelectedCoupons = async () => {
    let ids = [];
    selectedCoupons.map((coupon) => ids.push(coupon._id));
    try {
      let url = "http://localhost:3000/api/coupons/removeMany/coupons";
      let res = await axios.post(url, { ids });
      if (res.data.success) {
        let _coupons = coupons.filter((val) => !selectedCoupons.includes(val));
        setCoupons(_coupons);
        setDeleteCouponsDialog(false);
        setSelectedCoupons(null);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Coupons Deleted",
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "danger",
          summary: "Failed",
          detail: "Cannot delete coupons",
          life: 3000,
        });
        setDeleteCouponsDialog(false);
      }
    } catch (error) {
      console.log(error);
      setDeleteCouponsDialog(false);
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: "Cannot delete coupons",
        life: 3000,
      });
    }
  };
  //################ (4-B) DELETE MANY COUPONS LAYOUT ############################
  const deleteCouponsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={() => setDeleteCouponsDialog(false)}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedCoupons}
      />
    </React.Fragment>
  );

  //######## Getting Coupons && Products From DB ###########
  useEffect(() => {
    const getCoupons = async () => {
      let url = "http://localhost:3000/api/coupons/all";
      try {
        let res = await axios.get(url);
        setCoupons(res.data.coupons);
      } catch (error) {
        console.log(error);
      }
    };
    const getProducts = async () => {
      let url = "http://localhost:3000/api/products/all";
      try {
        let res = await axios.get(url);
        setProducts(res.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    getCoupons();
    getProducts();
  }, []);

  return (
    <div className="p-2 sm:p-3 card flex flex-column flex-wrap gap-3 align-items-center justify-content-center sm:flex-row">
      <Toolbar className="mb-4" left={toolbarTemplate}></Toolbar>
      <DataTable
        value={coupons}
        showGridlines
        stripedRows
        removableSort
        dataKey="_id"
        filters={filters}
        globalFilterFields={["name", "code"]}
        selection={selectedCoupons}
        onSelectionChange={(e) => setSelectedCoupons(e.value)}
        header={header}
        className="w-full"
        breakpoint="768px"
        columnResizeMode="fit"
        responsiveLayout="stack"
      >
        <Column selectionMode="multiple" exportable={false}></Column>
        <Column field="name" header="Name" sortable></Column>
        <Column field="code" header="Code" sortable></Column>
        <Column
          field="data.photo"
          header="Photo"
          body={photoBodyTemplate}
        ></Column>
        <Column
          field="active"
          header="Active"
          body={activeBodyTemplate}
        ></Column>
        <Column header="Actions" body={actionBodyTemplate}></Column>
      </DataTable>

      <Dialog
        visible={couponDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Coupon Details"
        modal
        className="p-fluid"
        footer={couponDialogFooter}
        onHide={hideDialog}
      >
        {submitted ? (
          <div className="flex justify-content-center align-items-center">
            <ProgressSpinner />
          </div>
        ) : (
          <form id="couponForm" onSubmit={saveCoupon}>
            {uploadedPhoto ? (
              <img
                src={URL.createObjectURL(uploadedPhoto)}
                alt=""
                width={200}
                className="coupon-image block m-auto pb-3"
              />
            ) : (
              <img
                src={coupon.photo}
                alt={coupon.photo}
                width={200}
                className="coupon-image block m-auto pb-3"
              />
            )}
            <div className="flex flex-row justify-content-center">
              <div className="image-upload">
                <label for="file-input">
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
                value={coupon.name}
                onChange={(e) => onFormChange(e)}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !coupon.name,
                })}
              />
              {submitted && !coupon.name && (
                <small className="p-error">Name is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="code" className="font-bold">
                Code
              </label>
              <InputText
                id="code"
                name="code"
                value={coupon.code}
                onChange={(e) => onFormChange(e)}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !coupon.code,
                })}
              />
              {submitted && !coupon.code && (
                <small className="p-error">Code is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="description" className="font-bold">
                Description
              </label>
              <InputTextarea
                id="description"
                name="description"
                value={coupon.description}
                onChange={(e) => onFormChange(e)}
                required
                rows={3}
                cols={20}
              />
            </div>

            <div className="field">
              <label className="mb-3 font-bold">Type</label>
              <Dropdown
                value={coupon.type}
                name="type"
                onChange={(e) => onFormChange(e)}
                options={[
                  "percentage off",
                  "amount off",
                  "free shipping",
                  "BOGO",
                  "free gift",
                ]}
                placeholder="choose a type.."
                className="capitalize"
                required={true}
              />
            </div>
            {coupon.type === "percentage off" && (
              <div className="field">
                <label className="mb-3 font-bold">Percentage Off</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={coupon.percentageOff}
                    name="percentageOff"
                    onValueChange={(e) => onFormChange(e)}
                    placeholder="% OFF"
                    max={100}
                    required={true}
                  />
                  <span className="p-inputgroup-addon bg-primary">%</span>
                </div>
              </div>
            )}
            {coupon.type === "amount off" && (
              <div className="field">
                <label className="mb-3 font-bold">Amount off</label>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon bg-primary">
                    <i className="pi pi-dollar"></i>
                  </span>
                  <InputNumber
                    value={coupon.amountOff}
                    name="amountOff"
                    onValueChange={(e) => onFormChange(e)}
                    placeholder="amount OFF"
                    required
                  />
                </div>
              </div>
            )}
            {coupon.type === "free gift" && (
              <div className="formgrid grid">
                <div className="field col">
                  <label htmlFor="gift" className="font-bold">
                    Free gift
                  </label>
                  <InputText
                    id="gift"
                    name="freeGift"
                    value={coupon.freeGift}
                    onChange={(e) => onFormChange(e)}
                    defaultValue={null}
                    placeholder="Free gift"
                  />
                </div>
                <div className="field col">
                  <label htmlFor="gift count" className="font-bold">
                    Gift count
                  </label>
                  <InputNumber
                    id="gift count"
                    name="giftCount"
                    value={coupon.giftCount}
                    onChange={(e) => onFormChange(e)}
                    placeholder="Gift count"
                    required={true}
                  />
                </div>
              </div>
            )}
            {coupon.type !== "free shipping" && (
              <div className="formgrid grid">
                <div className="field col">
                  <label htmlFor="products" className="font-bold">
                    Products
                  </label>
                  <MultiSelect
                    value={selectedProducts}
                    onChange={(e) => {setSelectedProducts(e.value) ; onFormChange(e)}}
                    onFocus={e=>console.log(selectedProducts)}
                    options={products}
                    name="products"
                    optionLabel="name"
                    filter
                    placeholder="Select products"
                    maxSelectedLabels={4}
                    className="w-full md:w-20rem"
                    required={coupon.type==='BOGO'?true:false}
                  />
                  <small className="text-green-500 ml-1">
                    {coupon.type === "BOGO"
                      ? "Add buy one get one free product(s)."
                      : coupon.type === "free gift"
                      ? "Add product(s) to get gift with."
                      : coupon.type === "precentage off" || "amount off"
                      ? "Add discounted products,if empty discount applies to the order."
                      : ""}
                  </small>
                </div>
              </div>
            )}

            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="startDate" className="font-bold">
                  Start Date
                </label>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon bg-primary">
                    <i className="pi pi-calendar"></i>
                  </span>
                  <Calendar
                    id="startDate"
                    name="startDate"
                    value={
                      coupon.startDate
                        ? new Date(coupon.startDate)
                        : coupon.startDate
                    }
                    onChange={(e) => onFormChange(e)}
                    placeholder="start date"
                    required={true}
                  />
                </div>
              </div>
              <div className="field col">
                <label htmlFor="expireDate" className="font-bold">
                  Expire Date
                </label>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon bg-primary">
                    <i className="pi pi-calendar"></i>
                  </span>
                  <Calendar
                    id="expireDate"
                    name="expireDate"
                    value={
                      coupon.expireDate
                        ? new Date(coupon.expireDate)
                        : coupon.expireDate
                    }
                    onChange={(e) => onFormChange(e)}
                    placeholder="expiration date"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="minimum" className="font-bold">
                  Minimum Purchase
                </label>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon bg-primary">$</span>
                  <InputNumber
                    id="minimumPurchase"
                    name="minimumPurchase"
                    value={coupon.minimumPurchase}
                    onValueChange={(e) => onFormChange(e)}
                    placeholder="Minimum Purchase"
                    required
                  />
                </div>
                <small className="text-green-500 ml-1">Tip: add 0 or negative value for no minimum</small>
              </div>
              <div className="field col">
                <label htmlFor="maximum" className="font-bold">
                  Maximum Purchase
                </label>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon bg-primary">$</span>
                  <InputNumber
                    id="maximumPurchase"
                    name="maximumPurchase"
                    value={coupon.maximumPurchase}
                    onValueChange={(e) => onFormChange(e)}
                    placeholder="Maximum Purchase"
                    required
                  />
                </div>
                <small className="text-green-500 ml-1">Tip: add 0 or negative value for no maximum</small>
              </div>
            </div>
            <div className="formgrid grid my-4">
              <div className=" col-6 flex flex-row align-items-center ">
                <TriStateCheckbox
                  name="active"
                  id="active"
                  value={coupon.active}
                  onChange={(e) => onFormChange(e)}
                  className="mr-2"
                  required
                />

                <label htmlFor="active" className="font-bold align-self-center">
                  Active
                </label>
              </div>
              <div className=" flex align-items-center">
                <TriStateCheckbox
                  id="automated"
                  name="automated"
                  value={coupon.automated}
                  onChange={(e) => onFormChange(e)}
                  className="mr-2"
                  required
                />
                <label htmlFor="automated" className="font-bold ">
                  Automated
                </label>
              </div>
            </div>
          </form>
        )}
      </Dialog>
      <Dialog
        visible={deleteCouponDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteCouponDialogFooter}
        onHide={() => setDeleteCouponDialog(false)}
      >
        <div className="confirmation-content flex ">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {coupon && (
            <span className="align-self-center">
              Are you sure you want to delete <b>{coupon.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={deleteCouponsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteCouponsDialogFooter}
        onHide={() => setDeleteCouponsDialog(false)}
      >
        <div className="confirmation-content flex">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          <span className="align-self-center">
            Are you sure you want to delete the selected coupons?
          </span>
        </div>
        {selectedCoupons && (
          <div className="flex-wrap flex flex-row py-2  justify-content-center">
            {selectedCoupons.map((element) => {
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

export default Coupons;
