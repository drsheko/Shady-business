import React from "react";
import { useState, useContext,useEffect, useRef } from "react";
import { UserContext } from "../../App";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
function Auth(props) {
  let { user, setUser } = useContext(UserContext);
  let toast = useRef(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      var res = await axios.post("http://localhost:3000/api/login", {
        email: form.email,
        password: form.password,
      });
      let success = res.data.success;
      if (success) {
        props.setAccountState((state) =>({...state, isSubmitted:true}))
        var loggedUser = res.data.user;
        // Save logged user to local storage
        localStorage.setItem("SHADY_BUSINESS_user", JSON.stringify(loggedUser));
        setUser(loggedUser);
      }
    } catch (err) {
        props.setAccountState((state) =>({...state, isSubmitted:false}))
      toast.current.show({
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
        props.setAccountState((state) =>({...state, isSubmitted:false}))
      localStorage.removeItem("SHADY_BUSINESS_user");
      setUser(null);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "You Logged out successfully",
        life: 5000,
      });
    }
  };
  useEffect(() => {
    if (!user) {
      props.setAccountState({ isActive:true, isSubmitted: false });
    }else{
        props.setAccountState({ isActive:false, isSubmitted: true });
    }
  }, [user]);
  return (
    <div>
      {user ? (
        <div className="flex felx-row justify-content-between align-items-center">
          <div className="flex felx-row align-items-center">
            <p className="font-semibold text-lg mr-1 sm:text-2xl sm:mr-3">
              Customer
            </p>
            <p className="font-semibold align-self-center text-primary text-sm sm:text-base">
              {user.email}
            </p>
          </div>

          <Button
            label="sign out"
            outlined
            onClick={handleLogout}
            size="small"
            className="hover:bg-primary "
          />
        </div>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="email" className="block text-900 font-medium mb-2">
            Email
          </label>
          <InputText
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="text"
            placeholder="Email address"
            className="w-full mb-3"
            required
          />
          <label htmlFor="password" className="block text-900 font-medium mb-2">
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
              inputStyle={{ width: "100%" }}
              required
            />
          </div>
          <Button label="Sign In" icon="pi pi-user" type="submit" />
        </form>
      )}
      <Toast ref={toast} />
    </div>
  );
}

export default Auth;
