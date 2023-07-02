import React from 'react';
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
function Billing(props) {
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
        </div>
    );
}

export default Billing;