import React, { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Messages } from "primereact/messages";
import { UserContext } from "../App";

function SignInSidebar(props) {
  const [checked, setChecked] = useState(false);
  let navigate = useNavigate();
  let { user, setUser } = useContext(UserContext);
  let msgs = useRef(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    msgs.current.clear();
    try {
      e.preventDefault();
      var res = await axios.post("http://localhost:3000/api/login", {
        email: form.email,
        password: form.password,
      });
      let success = res.data.success;
      if (success) {
        props.setSignInVisible(false);
        var loggedUser = res.data.user;
        // Save logged user to local storage
        localStorage.setItem("SHADY_BUSINESS_user", JSON.stringify(loggedUser));
        setUser(loggedUser);
      }
    } catch (err) {
      msgs.current.show({
        sticky: true,
        severity: "error",
        detail: err.response.data.error.message,
        closable: true,
      });
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    let url = "http://localhost:3000/api/logout";
    const res = await axios.get(url);
    if (res.data.success) {
      localStorage.removeItem("SHADY_BUSINESS_user");
      setUser(null);
      props.setSignInVisible(false);
      props.toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "You Logged out successfully",
        life: 5000,
      });
    }
  };
  return (
    <div>
      <Sidebar
        visible={props.signInVisible}
        onHide={() => props.setSignInVisible(false)}
        position="right"
        style={{ width: "400px" }}
      >
        {user ? (
          <div className="flex flex-column">
            <p className="capitalize font-bold text-xl font-italic mx-auto mb-4 text-primary">
              {" "}
              {user.firstName}
            </p>
            <div className="border-1 border-dashed my-2"></div>
            <Button
              label="Account"
              text
              raised
              className="my-2"
              onClick={() => {
                props.setSignInVisible(false);
                navigate("/account/orders");
              }}
            />
            <Button
              label="Orders"
              text
              raised
              className="my-2"
              onClick={() => {
                props.setSignInVisible(false);
                navigate("/account/orders");
              }}
            />
            <Button
              label="Addresses"
              text
              raised
              className="my-2"
              onClick={() => {
                props.setSignInVisible(false);
                navigate("/account/addresses");
              }}
            />
            <Button
              label="Settings"
              text
              raised
              className="my-2"
              onClick={() => {
                props.setSignInVisible(false);
                navigate("/account/settings");
              }}
            />
            <Button
              label="Logout"
              text
              raised
              className="my-2"
              onClick={handleLogout}
            />
          </div>
        ) : (
          <div className="flex align-items-center justify-content-center ">
            <div className="surface-card p-4  border-round w-full ">
              <div className="text-center mb-5">
                <div
                  className="bg-primary text-center mx-4 sm:mx-0 p-3 my-5 border-3 shadow-3"
                  style={{
                    transform: "skew(15deg)",
                    borderRadius: " 0px 25px 0px 25px ",
                  }}
                >
                  <p
                    className="font-bold text-xl text-0 "
                    style={{ transform: "skew(-15deg" }}
                  >
                    Vaporesta
                  </p>
                </div>
                <p className="text-primary text-3xl font-medium mb-3 ">
                  Welcome Back
                </p>
                <span className="text-600 font-medium line-height-3">
                  Don't have an account?
                </span>
                <a className="font-medium no-underline ml-2 text-primary cursor-pointer">
                  <Link
                    to="/signup"
                    className="no-underline text-primary"
                    onClick={() => props.setSignInVisible(false)}
                  >
                    Create today!
                  </Link>
                </a>
              </div>
              <form onSubmit={handleFormSubmit}>
                <Messages ref={msgs} className="signin-message" />
                <label
                  htmlFor="email"
                  className="block text-900 font-medium mb-2"
                >
                  Email
                </label>
                <InputText
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="text"
                  placeholder="Email address"
                  className="w-full mb-3 text-800"
                  required
                />
                <label
                  htmlFor="password"
                  className="block text-900 font-medium mb-2"
                >
                  Password
                </label>
                <div className="card flex justify-content-center mx-0 my-2 p-0 fluid">
                  <Password
                    value={form.password}
                    onChange={handleChange}
                    name="password"
                    className="w-full"
                    toggleMask
                    feedback={false}
                    pt={{
                      input: {
                        className: "text-800 w-full",
                      },
                    }}
                    required
                  />
                </div>
                <div className="flex flex-column sm:flex-row align-items-start sm:align-items-center justify-content-between mb-6">
                  <div className="flex align-items-center mb-2">
                    <Checkbox
                      id="rememberme"
                      onChange={(e) => setChecked(e.checked)}
                      checked={checked}
                      className="mr-2"
                    />
                    <label htmlFor="rememberme" className="text-800">
                      Remember me
                    </label>
                  </div>
                  <a className="font-medium no-underline m-0 sm:ml-2 text-primary text-right cursor-pointer">
                    Forgot password
                  </a>
                </div>
                <Button
                  label="Sign In"
                  icon="pi pi-user"
                  type="submit"
                  className="w-full"
                />
              </form>
            </div>
          </div>
        )}
      </Sidebar>
    </div>
  );
}

export default SignInSidebar;
