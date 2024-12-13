import React from "react";
import { useContext, useState, useRef, useEffect } from "react";
import { useShoppingCart } from "../../contexts/shoppingCartContext";
import axios from "axios";
import { UserContext } from "../../App";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";

function Shipping(props) {
  let { user, setUser } = useContext(UserContext);
  const toast = useRef();
  const { setShippingCost ,shippingAddress ,setShippingAddress, shippingMethod,setShippingMethod} = useShoppingCart();
 // const [ setShippingAddress] = useState(null);
 // const [shippingMethod, setShippingMethod] = useState(null);
  const [billingSameAddress, setBillingSameAddress] = useState(true);
  const [addressError, setAddressError] = useState(false);
  const [shippingMethodError, setShippingMethodError] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
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

  const [form, setForm] = useState({
    line1: "",
    line2: "",
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
      let server = "https://shady-business-server.onrender.com";
      let url = server+"/api/addresses/create/address";
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
  const onShippingSubmit = async () => {
    setAddressError(false);
    setShippingMethodError(false);
    let score = 0;
    if (!shippingAddress) {
      setAddressError(true);
      score += 1;
      let div = () => document.getElementById("shippingAddress");
      div().scrollIntoView({ behavior: "smooth", block: "end" });
      return;
    }
    if (!shippingMethod) {
      setShippingMethodError(true);
      score += 1;
      let div1 = () => document.getElementById("shippingMethod");
      div1().scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (billingSameAddress) {
      props.setBillingState((state) => ({ ...state, isSubmitted: true }));
      props.setCheckoutData((state) => ({
        ...state,
        billingSameAddress: true,
        billingAddress: shippingAddress,
      }));
    }
    if (score == 0) {
      shippingMethod === "standard"
        ? setShippingCost(4.99)
        : setShippingCost(9.99);
      
      props.setShippingState((state) => ({ ...state, isSubmitted: true })); 
    }
  };
  const editShipping = () => {
    if (billingSameAddress) {
      props.setShippingState((state) => ({ ...state, isSubmitted: false }));
      props.setBillingState((state) => ({ ...state, isSubmitted: false }));
    } else {
      props.setShippingState((state) => ({ ...state, isSubmitted: false }));
    }
  };

  useEffect(() => {
    if (!user) {
      setShippingAddress(null);
      setShippingMethod(null);
      setShippingCost(null);
      props.setShippingState((state) => ({ ...state, isSubmitted: false }));
      props.setBillingState((state) => ({ ...state, isSubmitted: false }));
    }
  }, [user]);
  useEffect(() => {
    if (shippingAddress) {
      setAddressError(false);
     // setShippingAddress(shippingAddress)
    }else{
      setShippingAddress(null)
    }
  }, [shippingAddress]);
  useEffect(() => {
    if (shippingMethod) {
      setShippingMethodError(false);
    }
  }, [shippingMethod]);
  return (
    <div className="my-4">
      {user && props.shippingState.isSubmitted ? (
        <div className="flex flex-column">
          <div className="flex flex-row justify-content-between align-items-center">
            <p className="font-semibold text-lg mr-1 sm:text-2xl sm:mr-3 ">
              {" "}
              Shipping
            </p>
            <Button
              label="Edit"
              outlined
              onClick={editShipping}
              size="small"
              className="hover:bg-primary"
            />
          </div>
          <div className="flex flex-column">
            <div className="card shadow-2 p-3 my-2 border-round-lg">
              <p className="m-0 capitalize text-800">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-800">{user.phone}</p>
              <p className="text-800">{shippingAddress.line1}</p>
              <p className="text-800">{shippingAddress.line2}</p>
              <p className="text-800">
                {shippingAddress.city},{shippingAddress.state},
                {shippingAddress.zipcode} / {shippingAddress.country}{" "}
              </p>
            </div>
            {shippingMethod === "standard" ? (
              <p className="mb-1"> Standard Shipping +4.99$ (3-5 days)</p>
            ) : (
              <p className="mb-1"> Premium Shipping +9.99$ (1-3 days)</p>
            )}
            {billingSameAddress && (
              <p>Billing will be send to the same address.</p>
            )}
          </div>
        </div>
      ) : user ? (
        <>
          <div className="protection">
            <div></div>
          </div>
          <div className="shipping-address my-3" id="shippingAddress">
            <p className="text-primary font-bold text-lg sm:text-2xl mb-3 underline">
              Shipping Address
            </p>
            {addressError && (
              <div className="bg-red-500 card shadow-2 p-2 px-3 border-round-lg">
                <p className="text-base sm:text-lg font-semibold text-white">
                  {" "}
                  Please choose an address.
                </p>
              </div>
            )}
            {user.address.length > 0 &&
              user.address.map((add) => {
                return (
                  <div className="flex felx-row my-2">
                    <RadioButton
                      inputId={add._id}
                      name="address"
                      value={add}
                      onChange={(e) => {
                        setShippingAddress(e.target.value);
                      }}
                      checked={shippingAddress === add}
                      className="mr-2 mt-3"
                    />
                    <Panel
                      header={add.line1}
                      toggleable
                      collapsed={shippingAddress !== add}
                      className="w-full max-w-28rem"
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
            <div className="flex flex-column my-2">
              <Button
                outlined
                size="small"
                label="Add Address"
                icon="pi pi-plus"
                onClick={() => setFormVisible(!formVisible)}
                className="max-w-max hover:bg-primary my-2"
              />
              {formVisible && (
                <div className="card my-2 p-4 shadow-3 border-round-lg">
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
                    <div className="flex align-items-center my-3">
                      <Checkbox
                        inputId="saveAddress"
                        onChange={(e) => setSaveNewAddress(!saveNewAddress)}
                        checked={saveNewAddress}
                      />
                      <label
                        htmlFor="saveAddress"
                        className="ml-2 font-medium text-sm sm:text-lg"
                      >
                        Save this address to my account.
                      </label>
                    </div>
                    <Button label="Confirm" size="small" className=" w-full" />
                  </form>
                </div>
              )}
            </div>
            <div className="billing">
              <div className="flex align-items-center my-3">
                <Checkbox
                  inputId="billing"
                  onChange={(e) => setBillingSameAddress(!billingSameAddress)}
                  checked={billingSameAddress}
                />
                <label
                  htmlFor="billing"
                  className="ml-2 font-medium text-sm sm:text-lg"
                >
                  My Billing address is the same as my Shipping address.
                </label>
              </div>
            </div>
            <div className="shipping-method my-3" id="shippingMethod">
              <p className="text-primary font-bold text-lg sm:text-2xl mb-3 underline">
                Shipping Method
              </p>
              {shippingMethodError && (
                <div className="bg-red-500 card shadow-2 p-2 px-3 border-round-lg">
                  <p className="text-base sm:text-lg font-semibold text-white">
                    {" "}
                    Please choose a shipping method.
                  </p>
                </div>
              )}
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
          <Button
            label="Continue"
            size="small"
            className="hover:bg-surface  align-self-end"
            onClick={onShippingSubmit}
          />
        </>
      ) : (
        <p className="font-semibold text-xl ml-2"> Shipping</p>
      )}
      <Toast ref={toast} />
    </div>
  );
}

export default Shipping;
