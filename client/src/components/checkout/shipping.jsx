import React from "react";
import { useContext, useState } from "react";
import { UserContext } from "../../App";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import {Checkbox} from 'primereact/checkbox'
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { useEffect } from "react";
import axios from "axios";
import { useRef } from "react";

function Shipping(props) {
  let { user, setUser } = useContext(UserContext);
  const toast = useRef();
  const [addressId, setAddressId] = useState();
  const [shippingMethod, setShippingMethod] =useState();
  const [billingSameAddress, setBillingSameAddress] =useState(true)
  const [form, setForm] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
  });
  const onFormChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setForm({ ...form, [name]: value });
  };
  const onFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = "http://localhost:3000/api/addresses/create/address";
      let data = { ...form, user: user._id };
      let res = await axios.post(url, data);
      if (res.data.success && res.data.address) {
        let adds = [...user.address];
        adds.push(res.data.address);
        setUser({ ...user, address: adds });
        setAddressId(res.data.address._id);
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

  return (
    <div>
      <p className="font-semibold text-xl "> Shipping</p>
      {user && (
        <>
          <div className="protection">
            <div></div>
          </div>
          <div className="shipping-address my-3">
            <p className="text-primary font-bold text-lg sm:text-2xl "> Shipping Address</p>
            {user.address.length > 0 &&
              user.address.map((add) => {
                return (
                  <div className="flex felx-row my-2">
                    <RadioButton
                      inputId={add._id}
                      name="address"
                      value={add._id}
                      onChange={(e) => {
                        setAddressId(e.target.value);
                      }}
                      checked={addressId === add._id}
                      className="mr-2 mt-3"
                    />
                    <Panel
                      header={add.line1}
                      toggleable
                      collapsed={addressId !== add._id}
                      className="w-full"
                    >
                      <p className="m-0 capitalize text-800">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-800">{user.phone}</p>
                      <p className="text-800">{add.line1}</p>
                      <p className="text-800">{add.line2}</p>
                      <p className="text-800">
                        {add.city},{add.state},{add.zipcode} / {add.country}{" "}
                      </p>
                    </Panel>
                  </div>
                );
              })}
            <div className="flex felx-row">
              <RadioButton
                name="address"
                value="new address"
                onChange={(e) => {
                  setAddressId(e.value);
                }}
                checked={addressId === "new address"}
                className="mr-2 mt-3"
              />
              <Panel
                header="New Address"
                toggleable
                collapsed={addressId !== "new address"}
                className="w-full"
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
                      name="addressLine1"
                      value={form.addressLine1}
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
                      name="addressLine2"
                      value={form.addressLine2}
                      onChange={onFormChange}
                      type="text"
                      placeholder="Address Line 2"
                      className="w-full mb-3"
                    />
                  </div>
                  <div className="flex flex-column p-0">
                    <label
                      htmlFor="city"
                      className="block text-900 font-medium mb-2"
                    >
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
                    <label
                      htmlFor="state"
                      className="block text-900 font-medium mb-2"
                    >
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
                  <Button
                    label="Save"
                    outlined
                    className="hover:bg-primary text-center"
                  />
                </form>
              </Panel>
            </div>
            <div className="billing">
            <div className="flex align-items-center my-3">
                <Checkbox
                  inputId="billing"
                  onChange={(e) => setBillingSameAddress(!billingSameAddress)}
                  checked={billingSameAddress}
                />
                <label htmlFor="billing" className="ml-2 font-medium text-sm sm:text-lg">
                My Billing address is the same as my Shipping address.
                </label>
              </div>
            </div>
            <div className="shipping-method my-3">
              <p className="text-primary font-bold text-lg sm:text-2xl mb-2">Shipping Method</p>
              <div className="flex align-items-center my-2">
                <RadioButton
                  inputId="shipping1"
                  name="standard"
                  value="standard"
                  onChange={(e) => setShippingMethod(e.value)}
                  checked={shippingMethod === "standard"}
                />
                <label htmlFor="shipping1" className="ml-2 ">
                 Standard Shipping +4.99$ (3-5 days)
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="shipping2"
                  name="premium"
                  value="premium"
                  onChange={(e) => setShippingMethod(e.value)}
                  checked={shippingMethod === "premium"}
                />
                <label htmlFor="shipping2" className="ml-2">
                Premium Shipping +9.99$ (1-3 days)
                </label>
              </div>
            </div>
          </div>
          <Button label="Continue" className="hover:bg-surface-50" />
        </>
      )}

      <Toast ref={toast} />
    </div>
  );
}

export default Shipping;
