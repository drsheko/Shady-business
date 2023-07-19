import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";

function Addresses(props) {
  const { user } = useContext(UserContext);
  const toastRef = useRef();
  const [addresses, setAddresses] = useState([]);
  const [formVisible, setFormVisible] = useState(false);

  const [form, setForm] = useState({});
  const emptyForm = {
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
  };
  const countries = [
    "Australia",
    "Brazil",
    "China",
    "Egypt",
    "France",
    "Germany",
    "India",
    "Japan",
    "Spain",
    "United States",
  ];
  const footer = () => {
    return (
      <div className="flex flex-row justify-content-end">
        <Button label="Cancel" />
        <Button label="Confirm" />
      </div>
    );
  };
  const onFormChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setForm({ ...form, [name]: value });
  };

  const onEdit = (address) => {
    console.log(address);

    setForm(address);
    setFormVisible(true);
  };

  const openNew = () => {
    setForm(emptyForm);
    setFormVisible(true);
  };
  const onFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = "http://localhost:3000/api/addresses/create/address";
      let data = { ...form, user: user._id, saveNewAddress };
      let res = await axios.post(url, data);
      if (res.data.success && res.data.address) {
        let adds = [...user.address];
        adds.push(res.data.address);
        setUser({ ...user, address: adds });
        setShippingAddress(res.data.address);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "New Address Saved.",
          life: 5000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Cant save new address.",
        life: 3000,
      });
    }
  };
  useEffect(() => {
    if (user) {
      setAddresses(user.address);
    }
  }, []);

  return (
    <div className="flex flex-column">
      {addresses.length > 0 ? (
        <div className="flex flex-row">
          {addresses.map((address) => {
            return (
              <div
                className=" p-3 my-2 border-round-lg  col-12 sm:col-6 md:col-4  "
                key={address._id}
              >
                <div className="card shadow-2 flex flex-row justify-content-between p-3">
                <div className="">
                  <p className="text-800 text-lg font-semibold">
                    {address.line1}
                  </p>
                  <p className="text-800 text-lg font-semibold">
                    {address.line2}
                  </p>
                  <p className="text-800 text-lg font-semibold">
                    {address.city},{address.state},{address.zipcode}
                  </p>
                  <p className="text-800 text-lg font-semibold">
                    {address.country}
                  </p>
                </div>

                <Button
                  icon="pi pi-pencil"
                  size="small"
                  rounded
                  text
                  raised
                  onClick={() => onEdit(address)}
                  className="hover:bg-primary"
                />
                </div>
                
              </div>
            );
          })}
        </div>
      ) : (
        "You don`t have any address"
      )}

      <Dialog
        visible={formVisible}
        style={{ width: "32rem" }}
        draggable={false}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Address details"
        modal
        footer={footer}
        onHide={() => setFormVisible(false)}
      >
        <form onSubmit={onFormSubmit}>
          <div className="flex flex-column p-0">
            <label
              htmlFor="address1"
              className="block text-900 font-medium mb-2"
            >
              Address Line 1
            </label>
            <InputText
              id="address1"
              name="line1"
              value={form.line1}
              onChange={onFormChange}
              type="text"
              placeholder="Address Line 1"
              className="w-full mb-3"
              required
            />
          </div>
          <div className="flex flex-column p-0">
            <label
              htmlFor="address2"
              className="block text-900 font-medium mb-2"
            >
              Address Line 2
            </label>
            <InputText
              id="address2"
              name="line2"
              value={form.line2}
              onChange={onFormChange}
              type="text"
              placeholder="Address Line 2"
              className="w-full mb-3"
            />
          </div>
          <div className="flex flex-column p-0">
            <label htmlFor="city" className="block text-900 font-medium mb-2">
              City
            </label>
            <InputText
              id="city"
              name="city"
              value={form.city}
              onChange={onFormChange}
              type="text"
              placeholder="city"
              className="w-full mb-3"
              required
            />
          </div>
          <div className="flex flex-column p-0">
            <label htmlFor="state" className="block text-900 font-medium mb-2">
              State
            </label>
            <InputText
              id="state"
              name="state"
              value={form.state}
              onChange={onFormChange}
              type="text"
              placeholder="State"
              className="w-full mb-3"
              required
            />
          </div>
          <div className="flex flex-column p-0">
            <label
              htmlFor="country"
              className="block text-900 font-medium mb-2"
            >
              Country
            </label>
            <Dropdown
              id="country"
              name="country"
              value={form.country}
              onChange={onFormChange}
              options={countries}
              filter
              showClear
              placeholder="Select a Country"
              className="w-full mb-3"
              required
            />
          </div>
          <div className="flex flex-column p-0">
            <label
              htmlFor="zipcode"
              className="block text-900 font-medium mb-2"
            >
              Zip/Postcode
            </label>
            <InputText
              id="zipcode"
              name="zipcode"
              value={form.zipcode}
              onChange={onFormChange}
              type="text"
              keyfilter="int"
              placeholder="Zip/Postcode"
              className="w-full mb-3"
              required
            />
          </div>
        </form>
      </Dialog>
      <Button label="Add Address" onClick={openNew} />
      <Toast ref={toastRef} />
    </div>
  );
}

export default Addresses;
