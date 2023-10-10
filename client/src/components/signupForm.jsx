import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { Calendar } from "primereact/calendar";
import { Messages } from "primereact/messages";
import SignInSidebar from "./sign-in-sidebar";

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
function Signup(props) {
  const navigate = useNavigate();
  const msgs = useRef(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const [signInVisible, setSignInVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    country: "",
    zipcode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    password: "",
    confirmPassword: "",
  });
  const onFormChange = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    setForm({ ...form, [name]: value });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    let url = "http://localhost:3000/api/signup";
    try {
      let res = await axios.post(url, {
        form,
      });
      if (res) {
        setAccountCreated(true);
      }
    } catch (error) {
      console.log(error);
      window.scrollTo(0, 0);
      msgs.current.show([
        {
          sticky: true,
          severity: "error",
          summary: error.response.data.error,
          detail: error.response.data.msg,
          closable: true,
        },
      ]);
    }
  };
  return (
    <div>
      {accountCreated ? (
        <div className="flex flex-column">
          account created successfully
          <Link
            to={".."}
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
            className="p-button no-underline font-bold mx-auto my-4"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="flex align-items-center justify-content-center">
          <div className="surface-card p-4  border-round w-full ">
            <div className="text-center mb-5">
              <Messages ref={msgs} />
              <img
                src=".\src\assets\sign-up.jpg"
                height={50}
                className="mb-2"
              />
              <div className="text-900 text-3xl font-medium ">
                Join us Today !!
              </div>
              <span className="text-600 font-medium line-height-3">
                Already a member?
              </span>
              <span className="font-semibold text-lg no-underline ml-1 text-primary cursor-pointer" onClick={()=>setSignInVisible(true)}>
                sign in
              </span>
            </div>

            <form
              className="formgrid grid flex-row flex-wrap w-full col-gap-1 px-0 sm:px-1 md:px-5 lg:px-8"
              onSubmit={onFormSubmit}
            >
              <div className="field col-12 sm:col-6 ">
                <label
                  htmlFor="firstname"
                  className="block text-900 font-medium mb-2"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <InputText
                  id="firstname"
                  value={form.firstName}
                  onChange={onFormChange}
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  className="w-full text-800"
                  required
                />
              </div>
              <div className="field col-12 sm:col-6">
                <label
                  htmlFor="lastname"
                  className="block text-900 font-medium mb-2"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <InputText
                  id="lastname"
                  value={form.lastName}
                  name="lastName"
                  onChange={onFormChange}
                  type="text"
                  placeholder="Last Name"
                  className="w-full text-800"
                  required
                />
              </div>
              <div className="field col-12 sm:col-6">
                <label
                  htmlFor="email"
                  className="block text-900 font-medium mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <InputText
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={onFormChange}
                  type="email"
                  placeholder="Email address"
                  className="w-full text-800"
                  required
                />
              </div>
              <div className="field col-12 sm:col-6">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-900 font-medium mb-2"
                >
                  Date Of Birth <span className="text-red-500">*</span>
                </label>
                <Calendar
                  value={form.dateOfBirth}
                  name="dateOfBirth"
                  showIcon
                  inputStyle={{ color: `var(--surface-800)` }}
                  onChange={onFormChange}
                  className="w-full text-800"
                  pt={{
                    yearTitle: {
                      className: "hover:text-800",
                    },
                    monthTitle: {
                      className: "hover:text-800",
                    },
                  }}
                  required
                />
              </div>

              <div className="field col-12">
                <label
                  htmlFor="address1"
                  className="block text-900 font-medium mb-2"
                >
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <InputText
                  id="address1"
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={onFormChange}
                  type="text"
                  placeholder="Address Line 1"
                  className="w-full text-800"
                  required
                />
              </div>
              <div className="field col-12">
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
                  placeholder="Address Line 2 (optional)"
                  className="w-full text-800"
                />
              </div>
              <div className="field col-12 sm:col-6">
                <label
                  htmlFor="state"
                  className="block text-900 font-medium mb-2"
                >
                  State <span className="text-red-500">*</span>
                </label>
                <InputText
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={onFormChange}
                  type="text"
                  placeholder="State"
                  className="w-full text-800"
                  required
                />
              </div>
              <div className="field col-12 sm:col-6">
                <label
                  htmlFor="country"
                  className="block text-900 font-medium mb-2"
                >
                  Country <span className="text-red-500">*</span>
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
                  className="w-full "
                  pt={{
                    input: { className: "text-800" },
                    item: {
                      className: "text-800",
                    },
                  }}
                  required
                />
              </div>
              <div className="field col-12 sm:col-6">
                <label
                  htmlFor="phone"
                  className="block text-900 font-medium mb-2"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <InputMask
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={onFormChange}
                  mask="(999) 999-9999?"
                  placeholder="(999) 999-9999"
                  className="w-full text-800"
                  required
                ></InputMask>
              </div>
              <div className="field col-12 sm:col-6">
                <label
                  htmlFor="zipcode"
                  className="block text-900 font-medium mb-2"
                >
                  Zip/Postcode <span className="text-red-500">*</span>
                </label>
                <InputText
                  id="zipcode"
                  name="zipcode"
                  value={form.zipcode}
                  onChange={onFormChange}
                  type="text"
                  keyfilter="int"
                  placeholder="Zip/Postcode"
                  className="w-full text-800"
                  required
                />
              </div>

              <div className="field col-12 sm:col-6">
                <label
                  htmlFor="password"
                  className="block text-900 font-medium mb-2"
                >
                  Password <span className="text-red-500">*</span>
                </label>

                <div className="card flex justify-content-center mx-0 my-2 p-0 fluid">
                  <Password
                    className="w-full"
                    value={form.password}
                    name="password"
                    placeholder="Password"
                    onChange={onFormChange}
                    toggleMask
                    pt={{
                      input: {
                        className: "text-800 w-full",
                      },
                    }}
                    required
                  />
                </div>
              </div>
              <div className="field col-12 sm:col-6">
                <label
                  htmlFor="password"
                  className="block text-900 font-medium mb-2"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>

                <div className="card flex justify-content-center mx-0 my-2 p-0 fluid">
                  <Password
                    className="w-full"
                    toggleMask
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={onFormChange}
                    feedback={false}
                    placeholder="Confirm Password"
                    pt={{
                      input: {
                        className: "text-800 w-full",
                      },
                    }}
                    required
                  />
                </div>
              </div>

              <div className="flex align-items-center justify-content-between mb-3">
                <div className="flex align-items-center">
                  <Checkbox
                    id="terms"
                    onChange={(e) => setChecked(e.checked)}
                    checked={checked}
                    className="mr-2"
                  />
                  <label htmlFor="terms">I agree to Terms and conditions</label>
                </div>
              </div>

              <Button
                label="Create Account"
                type="submit"
                icon="pi pi-user"
                className="w-full shadow-4 mb-5"
              />
            </form>
          </div>
        </div>
      )}
       <SignInSidebar
          signInVisible={signInVisible}
          setSignInVisible={setSignInVisible}
        />
    </div>
  );
}

export default Signup;
