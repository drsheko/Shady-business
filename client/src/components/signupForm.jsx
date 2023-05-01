import React, { useState } from "react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { Calendar } from "primereact/calendar";

const countries = [
  { name: "Australia", code: "AU" },
  { name: "Brazil", code: "BR" },
  { name: "China", code: "CN" },
  { name: "Egypt", code: "EG" },
  { name: "France", code: "FR" },
  { name: "Germany", code: "DE" },
  { name: "India", code: "IN" },
  { name: "Japan", code: "JP" },
  { name: "Spain", code: "ES" },
  { name: "United States", code: "US" },
];
function Signup(props) {
  const [checked, setChecked] = useState(false);
  const [country, setCountry] = useState(null);
  const [date, setDate] = useState(null);
  return (
    <div>
      <div className="flex align-items-center justify-content-center">
        <div className="surface-card p-4 shadow-4 border-round w-full ">
          <div className="text-center mb-5">
            <img
              src="/assets/images/blocks/logos/hyper.svg"
              height={50}
              className="mb-3"
            />
            <div className="text-900 text-3xl font-medium mb-3">
              Join us Today !!
            </div>
            <span className="text-600 font-medium line-height-3">
              already a member?
            </span>
            <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
              sign in
            </a>
          </div>

          <div className="formgrid grid flex-row flex-wrap w-full gap-1">
            <div className="flex flex-column col-5 p-0 field ">
              <label
                htmlFor="firstname"
                className="block text-900 font-medium mb-2"
              >
                First Name
              </label>
              <InputText
                id="firstname"
                type="text"
                placeholder="First Name"
                className="w-full mb-3"
              />
            </div>
            <div className="flex flex-column col-5 p-0 field">
              <label
                htmlFor="lastname"
                className="block text-900 font-medium mb-2"
              >
                Last Name
              </label>
              <InputText
                id="lastname"
                type="text"
                placeholder="Last Name"
                className="w-full mb-3"
              />
            </div>
            <div className="flex flex-column col-6 p-0">
              <label
                htmlFor="email"
                className="block text-900 font-medium mb-2"
              >
                Email
              </label>
              <InputText
                id="email"
                type="text"
                placeholder="Email address"
                className="w-full mb-3"
              />
            </div>
            <div className="flex flex-column col-6 p-0">
              <label
                htmlFor="country"
                className="block text-900 font-medium mb-2"
              >
                Country
              </label>
              <Dropdown
                id="country"
                value={country}
                onChange={(e) => setCountry(e.value)}
                options={countries}
                filter
                showClear
                optionLabel="name"
                placeholder="Select a Country"
                className="w-full mb-3"
              />
            </div>
            <div className="flex flex-column col-6 p-0">
              <label
                htmlFor="address1"
                className="block text-900 font-medium mb-2"
              >
                Address Line 1
              </label>
              <InputText
                id="address1"
                type="text"
                placeholder="Address Line 1"
                className="w-full mb-3"
              />
            </div>
            <div className="flex flex-column col-6 p-0">
              <label
                htmlFor="address2"
                className="block text-900 font-medium mb-2"
              >
                Address Line 2
              </label>
              <InputText
                id="address2"
                type="text"
                placeholder="Address Line 2"
                className="w-full mb-3"
              />
            </div>
            <div className="flex flex-column col-6 p-0">
              <label
                htmlFor="state"
                className="block text-900 font-medium mb-2"
              >
                State
              </label>
              <InputText
                id="state"
                type="text"
                placeholder="State"
                className="w-full mb-3"
              />
            </div>
            <div className="flex flex-column col-6 p-0">
              <label
                htmlFor="dateOfBirth"
                className="block text-900 font-medium mb-2"
              >
                Date Of Birth
              </label>
              <Calendar
                value={date}
                onChange={(e) => setDate(e.value)}
                className="w-full mb-3"
              />
            </div>
            <div className="flex flex-column col-6 p-0">
              <label
                htmlFor="zipcode"
                className="block text-900 font-medium mb-2"
              >
                Zip/Postcode
              </label>
              <InputText
                id="zipcode"
                type="text"
                keyfilter="int"
                placeholder="Zip/Postcode"
                className="w-full mb-3"
              />
            </div>
            <div className="flex flex-column col-6 p-0">
              <label
                htmlFor="phone"
                className="block text-900 font-medium mb-2"
              >
                Phone Number
              </label>
              <InputMask
                id="phone"
                mask="(999) 999-9999?"
                placeholder="(999) 999-9999"
                className="w-full mb-3"
              ></InputMask>
            </div>
            <div className="flex flex-column col-6 p-0">
              <label
                htmlFor="password"
                className="block text-900 font-medium mb-2"
              >
                Password
              </label>

              <div className="card flex justify-content-center mx-0 my-2 p-0 fluid">
                <Password
                  className="w-full"
                  toggleMask
                  inputStyle={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="flex flex-column col-6 p-0">
              <label
                htmlFor="password"
                className="block text-900 font-medium mb-2"
              >
                Confirm Password
              </label>

              <div className="card flex justify-content-center mx-0 my-2 p-0 fluid">
                <Password
                  className="w-full"
                  toggleMask
                  feedback={false}
                  inputStyle={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="flex align-items-center justify-content-between mb-6">
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
              icon="pi pi-user"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
