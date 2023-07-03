import React, { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import moment from "moment";

import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";

function Payment(props) {
  const [active, setActive] = useState(true);
  let months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const [form, setForm] = useState({
    number: "",
    expiry: "",
    month: "",
    date: "",
    cvc: "",
    name: "",
    focus: "",
  });
  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    if (name === "date") {
      setForm({ ...form, expiry: moment(value).format("MMYY") });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInputFocus = (evt) => {
    if (evt.target.name === "date") {
      setForm({ ...form, focus: "expiry" });
    } else {
      setForm((prev) => ({ ...prev, focus: evt.target.name }));
    }
  };

  return (
    <div>
      {!active ? (
        <div>
          <p className="font-semibold text-xl ml-4"> Payment</p>
        </div>
      ) : (
        <div>
          <p className="font-semibold text-primary mb-3 text-2xl">
            Payment Method
          </p>
          <button onClick={() => setActive(!active)}>close</button>
          <Cards
            number={form.number}
            expiry={form.expiry}
            cvc={form.cvc}
            name={form.name}
            focused={form.focus}
            preview={true}
            locale={{ valid: "expiration" }}
          />
          <form className="my-3">
            <div class="field flex flex-column">
              <label for="number" className="font-semibold">
                Card Number
              </label>
              <InputText
                id="number"
                value={form.number}
                name="number"
                onChange={(e) => handleInputChange(e)}
                placeholder="Card Number"
                keyfilter="int"
                maxLength={16}
                onFocus={(e) => {
                  handleInputFocus(e);
                }}
                className="p-inputtext-sm"
              />
            </div>
            <div class="field flex flex-column">
              <label for="name" className="font-semibold">
                Name
              </label>
              <InputText
                id="name"
                value={form.name}
                name="name"
                onChange={(e) => handleInputChange(e)}
                onFocus={(e) => {
                  handleInputFocus(e);
                }}
                placeholder="Card Holder Name"
                className="p-inputtext-sm text-800 font-semi-bold"
              />
            </div>
            <div className="field flex flex-row justify-content-between">
              <div class="field flex flex-column col-6">
                <label for="date" className="font-semibold">
                  Expiration Date
                </label>
                <Calendar
                  id="date"
                  value={form.date}
                  name="date"
                  onChange={(e) => handleInputChange(e)}
                  onFocus={(e) => handleInputFocus(e)}
                  view="month"
                  dateFormat="mm/y"
                />
              </div>
              <div class="field flex flex-column col-6">
                <label for="cvs" className="font-semibold">
                  Card Verification Code
                </label>
                <InputText
                  id="cvc"
                  value={form.cvc}
                  name="cvc"
                  onChange={(e) => handleInputChange(e)}
                  placeholder="CVC"
                  keyfilter="int"
                  maxLength={4}
                  onFocus={(e) => {
                    handleInputFocus(e);
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Payment;
