import React, { useState, useEffect, useContext, useRef } from "react";
import Cards from "react-credit-cards-2";
import { UserContext } from "../../App";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import moment from "moment";
import axios from "axios";

function Payment(props) {
  const [active, setActive] = useState(true);
  let { user, setUser } = useContext(UserContext);
  let toast = useRef();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [saveNewCard, setSaveNewCard] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [form, setForm] = useState({
    number: "",
    expiry: "",
    date: "",
    cvc: "",
    name: "",
    focus: "",
  });
  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    if (name === "date") {
      setForm({ ...form, expiry: moment(value).format("MMYY"), date: value });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const editPayment = () => {
    props.setPaymentState((state) => ({ ...state, isSubmitted: false }));
  };
  const handleInputFocus = (evt) => {
    if (evt.target.name === "date") {
      setForm({ ...form, focus: "expiry" });
    } else {
      setForm((prev) => ({ ...prev, focus: evt.target.name }));
    }
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = "http://localhost:3000/api/payments/new/payment";
      let data = { ...form, user: user._id, saveToAccount: saveNewCard };
      let res = await axios.post(url, data);
      if (res.data.success && res.data.payment) {
        let newPayment = res.data.payment;
        setSelectedPayment(newPayment);
        let _payments = [...user.payments];
        _payments.push(newPayment);
        setUser({ ...user, payments: _payments });
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "New card Saved.",
          life: 5000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Cant save new card.",
        life: 3000,
      });
    }
  };
  const onPaymentSubmit = () => {
    setPaymentError(false);
    if (!selectedPayment) {
      setPaymentError(true);
      let div = () => document.getElementById("cardFrom");
      div().scrollIntoView({ behavior: "smooth", block: "end" });
      return;
    } else {
      props.setCheckoutData((state) => ({
        ...state,
        payment: selectedPayment,
      }));
      props.setPaymentState((state) => ({ ...state, isSubmitted: true }));
    }
  };

  useEffect(() => {
    if (selectedPayment) {
      setPaymentError(false);
    }
  }, [selectedPayment]);
  return (
    <div className="my-4">
      {user && props.paymentState.isSubmitted ? (
        <div className="flex flex-column">
          <div className="flex flex-row justify-content-between align-items-center">
            <p className="font-semibold text-lg mr-1 sm:text-2xl sm:mr-3 ">
              {" "}
              Payment{" "}
            </p>
            <Button
              label="Edit"
              outlined
              onClick={editPayment}
              size="small"
              className="hover:bg-primary"
            />
          </div>
          <div className="p-0 sm:p-2 mt-3 mb-2 flex flex-row justify-content-start">
            <div>
            <Cards
              number={
                "************" + selectedPayment.cardNumber.toString().slice(-4)
              }
              expiry={moment(selectedPayment.expiration).format("MMYY")}
              cvc={selectedPayment.cvc}
              name={selectedPayment.cardHolder}
              preview={true}
              locale={{ valid: "expiration" }}
              className="align-self-start"
            />
            </div>
          </div>
        </div>
      ) : user && props.billingState.isSubmitted ? (
        <>
          <div className="shipping-address my-3" id="shippingAddress">
            <p className="text-primary font-bold text-lg sm:text-2xl mb-3 underline">
              Payment
            </p>
            {paymentError && (
              <div className="bg-red-500 card shadow-2 p-2 px-3 border-round-lg">
                <p className="text-base sm:text-lg font-semibold text-white">
                  Please choose a card.
                </p>
              </div>
            )}
            {user.payments.length > 0 &&
              user.payments.map((payment) => {
                return (
                  <div
                    className="flex felx-row align-items-center my-2"
                    key={payment._id}
                  >
                    <RadioButton
                      inputId={payment._id}
                      name="payments"
                      value={payment}
                      onChange={(e) => {
                        setSelectedPayment(e.target.value);
                      }}
                      checked={selectedPayment === payment}
                      className="mr-2"
                    />
                    <div className="w-full flex flex-row align-items-center my-2 cursor-pointer	" onClick={()=>setSelectedPayment(payment)}>
                      <i
                        className={`pi pi-credit-card ${
                          selectedPayment === payment
                            ? "text-primary"
                            : "text-800"
                        } mr-3`}
                      ></i>
                      <p
                        className={`${
                          selectedPayment === payment
                            ? "text-primary"
                            : "text-800"
                        } `}
                      >
                        ************{payment.cardNumber.toString().slice(-4)}
                      </p>
                    </div>
                  </div>
                );
              })}
            <div className="flex flex-column my-2">
              <Button
                outlined
                size="small"
                label="Add Card"
                icon="pi pi-plus"
                onClick={() => setFormVisible(!formVisible)}
                className="max-w-max hover:bg-primary my-2"
              />
              {formVisible && (
                <div className="card my-2 p-4 shadow-3 border-round-lg">
                  <Cards
                    number={form.number}
                    expiry={form.expiry}
                    cvc={form.cvc}
                    name={form.name}
                    focused={form.focus}
                    preview={true}
                    locale={{ valid: "expiration" }}
                  />
                  <form onSubmit={onFormSubmit} id="cardForm" className="mt-3">
                    <div className="field flex flex-column my-1">
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
                        required
                      />
                    </div>
                    <div className="field flex flex-column my-1">
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
                        required
                      />
                    </div>
                    <div className=" flex flex-row justify-content-between mt-1 mb-0">
                      <div className="field flex flex-column col-6">
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
                          className="p-inputtext-sm"
                          required
                        />
                      </div>
                      <div className="field flex flex-column col-6 ">
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
                          className="p-inputtext-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex align-items-center mt-0 mb-3">
                      <Checkbox
                        inputId="saveCard"
                        onChange={(e) => setSaveNewCard(!saveNewCard)}
                        checked={saveNewCard}
                      />
                      <label
                        htmlFor="saveCard"
                        className="ml-2 font-medium text-sm sm:text-lg"
                      >
                        Save this card to my account.
                      </label>
                    </div>
                    <Button label="Confirm" size="small" className=" w-full" />
                  </form>
                </div>
              )}
            </div>
          </div>
          <Button
            label="Continue"
            size="small"
            className="hover:bg-surface  align-self-end"
            onClick={onPaymentSubmit}
          />
        </>
      ) : (
        <p className="font-semibold text-xl ml-2"> Payment</p>
      )}
      <Toast ref={toast} />
    </div>
  );
}

export default Payment;
