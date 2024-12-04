import React, { useContext, useEffect, useRef, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import axios from "axios";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { Calendar } from "primereact/calendar";
import { Messages } from "primereact/messages";
import { Toast } from "primereact/toast";
import { UserContext } from "../App";
import { AccountIndexContext } from "./account";

function AccountSettings(props) {
  const { user, setUser } = useContext(UserContext);
  let {setActiveIndex} = useContext(AccountIndexContext)
  setActiveIndex(2)
  const toast = useRef();
  const msgs = useRef(null);
  const passwordMsgs = useRef(null);
  const [infoForm, setInfoForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const onFormChange = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    setInfoForm((form) => ({ ...form, [name]: value }));
  };
  const onPasswordFormChange = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    setPasswordForm((form) => ({ ...form, [name]: value }));
  };
  const onInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = "http://localhost:3000/api/account/edit/info";
      let data = { ...infoForm, id: user._id };
      let res = await axios.post(url, data);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem(
          "SHADY_BUSINESS_user",
          JSON.stringify(res.data.user)
        );
        msgs.current.show([
          {
            severity: "success",
            summary: "Success",
            detail: "Info has been updated",
            life: 5000,
          },
        ]);
      } else {
        msgs.current.show([
          {
            severity: "error",
            summary: "Error",
            detail: "Email is already in use !!",
            life: 5000,
          },
        ]);
      }
    } catch (error) {
      msgs.current.show([
        {
          severity: "error",
          summary: "Error",
          detail: "Internal server error !!",
          life: 5000,
        },
      ]);
    }
  };
  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    passwordMsgs.current.clear()
    if (
      passwordForm.newPassword.trim() !== passwordForm.confirmPassword.trim()
    ) {
      passwordMsgs.current.show([
        {
          severity: "error",
          detail: " Confirm password dose not match.",
          sticky: true,
        },
      ]);
      return;
    }
    try {
      let url = "http://localhost:3000/api/account/password/edit";
      let data = { ...passwordForm, id: user._id };
      let res = await axios.post(url, data);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem(
          "SHADY_BUSINESS_user",
          JSON.stringify(res.data.user)
        );
        passwordMsgs.current.show([
          {
            severity: "success",
            summary: "Success",
            detail: "Password has been updated",
            sticky: true,
          },
        ]);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        passwordMsgs.current.show([
          {
            severity: "error",
            detail: " Incorrect Password",
            sticky: true,
          },
        ]);
      }
    } catch (error) {
      passwordMsgs.current.show([
        {
          severity: "error",
          summary: "Error",
          detail: "Internal server error !!",
          sticky: true,
        },
      ]);
    }
  };
 
  useEffect(() => {
    if (user) {
      setInfoForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      });
    }
  }, []);
  return (
    <div className="  border-round-md shadow-4">
      <TabView
        pt={{
          root: {
            className:
              "flex flex-column justify-content-center align-items-center",
          },

          panelContainer: {
            className: "min-w-full",
          },
        }}
      >
        <TabPanel header="Account Info">
          <Messages ref={msgs} />
          <form onSubmit={onInfoSubmit}>
            <div className="flex flex-column sm:flex-row flex-wrap">
              <div className="flex flex-column col-12 sm:col-6 px-2 field mb-0">
                <label
                  htmlFor="firstname"
                  className="block text-900 font-medium mb-2"
                >
                  First Name
                </label>
                <InputText
                  id="firstname"
                  value={infoForm.firstName}
                  onChange={onFormChange}
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  className="w-full mb-3 capitalize"
                  required
                />
              </div>
              <div className="flex flex-column col-12 sm:col-6 px-2 field mb-0">
                <label
                  htmlFor="lastname"
                  className="block text-900 font-medium mb-2"
                >
                  Last Name
                </label>
                <InputText
                  id="lastname"
                  value={infoForm.lastName}
                  name="lastName"
                  onChange={onFormChange}
                  type="text"
                  placeholder="Last Name"
                  className="w-full mb-3 capitalize"
                  required
                />
              </div>
              <div className="flex flex-column col-12 sm:col-6 px-2 field m-0 ">
                <label
                  htmlFor="email"
                  className="block text-900 font-medium mb-2"
                >
                  Email
                </label>
                <InputText
                  id="email"
                  name="email"
                  value={infoForm.email}
                  onChange={onFormChange}
                  type="email"
                  placeholder="Email address"
                  className="w-full mb-3"
                  required
                />
              </div>
              <div className="flex flex-column col-12 sm:col-6 px-2 field m-0">
                <label
                  htmlFor="phone"
                  className="block text-900 font-medium mb-2"
                >
                  Phone
                </label>

                <InputMask
                  id="phone"
                  name="phone"
                  value={infoForm.phone}
                  onChange={onFormChange}
                  mask="(999) 999-9999?"
                  placeholder="(999) 999-9999"
                  className="w-full mb-3"
                  required
                ></InputMask>
              </div>
            </div>
            <div>
              <Button label="Update" type="submit" />
            </div>
          </form>
        </TabPanel>
        <TabPanel header="Password">
          <Messages ref={passwordMsgs} />
          <form onSubmit={onPasswordSubmit}>
            <div className="flex flex-column col-12 sm:col-6 px-2 field mb-0">
              <label
                htmlFor="currentPassword"
                className="block text-900 font-semibold mb-2"
              >
                Current Password <span className="text-red-500">*</span>
              </label>
              <Password
                id="currentPassword"
                value={passwordForm.currentPassword}
                onChange={onPasswordFormChange}
                name="currentPassword"
                placeholder="Current Password"
                className=" mb-3"
                feedback={false}
                pt={{
                  input: {
                    className: "w-full text-800",
                  },
                }}
                toggleMask
                required
              />
            </div>
            <div className="flex flex-column sm:flex-row flex-wrap">
              <div className="flex flex-column col-12 sm:col-6 px-2 field mb-0">
                <label
                  htmlFor="newPassword"
                  className="block text-900 font-semibold mb-2"
                >
                  New Password <span className="text-red-500">*</span>
                </label>
                <Password
                  id="newPassword"
                  value={passwordForm.newPassword}
                  name="newPassword"
                  onChange={onPasswordFormChange}
                  placeholder="New Password"
                  className="w-full mb-3"
                  pt={{
                    input: {
                      className: "w-full text-800",
                    },
                  }}
                  toggleMask
                  required
                />
              </div>
              <div className="flex flex-column col-12 sm:col-6 px-2 field m-0  ">
                <label
                  htmlFor="confirmPassword"
                  className="block text-900 font-semibold mb-2"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <Password
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={onPasswordFormChange}
                  placeholder="Confirm Password"
                  className="w-full mb-3"
                  pt={{
                    input: {
                      className: "w-full text-800",
                    },
                  }}
                  toggleMask
                  required
                />
              </div>
            </div>
            <div>
              <Button label="Update" type="submit" />
            </div>
          </form>
        </TabPanel>
      </TabView>
      <Toast ref={toast} />
    </div>
  );
}

export default AccountSettings;
