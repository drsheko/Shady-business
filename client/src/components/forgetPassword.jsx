import React, { useState } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import SignInSidebar from "./sign-in-sidebar";
function ForgetPassword(props) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState(false);
  const [isCodeSubmitted, setIsCodeSubmitted] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [signInVisible, setSignInVisible] = useState(false);

  const onFormChange = (e) => {
    resetErrors();
    let value = e.target.value;
    let name = e.target.name;
    setForm((form) => ({ ...form, [name]: value }));
  };
  const resetErrors = () => {
    setError(false);
    setServerError(false);
  };
  const sendCode = async (e) => {
    e.preventDefault();
    resetErrors();
    try {
      let url = "https://shady-business-server.onrender.com/api/resetpassword/sendcode";
      let res = await axios.post(url, { email });
      if (res.data.success) {
        setIsCodeSent(true);
      } else {
        setError(true);
      }
    } catch (error) {
      setServerError(true);
    }
  };
  const submitCode = async (e) => {
    e.preventDefault();
    resetErrors();
    try {
      let url = "https://shady-business-server.onrender.com/api/resetpassword/matchcode";
      let res = await axios.post(url, { code, email });
      if (res.data.success) {
        setIsCodeSubmitted(true);
      } else {
        setError(true);
      }
    } catch (error) {
      setServerError(true);
    }
  };
  const resetPassword = async (e) => {
    e.preventDefault();
    resetErrors();
    if (form.password.trim() !== form.confirmPassword.trim()) {
      setError(true);
      return;
    }
    try {
      let server = "https://shady-business-server.onrender.com";
      let url = server + "/api/resetpassword/resetpassword";
      let res = await axios.post(url, { email, password: form.password });
      if (res.data.success && res.data.user) {
        setSuccess(true);
      }
    } catch (error) {
      setServerError(true);
    }
  };
  return (
    <div>
      {success ? (
        <div className="flex justify-content-center">
          <div className="p-3 w-12 sm:w-9 md:w-6">
            <div className="flex flex-column justify-content-center align-items-center pt-4">
              <i className="pi pi-check text-4xl  font-bold text-green-600 border-2 border-circle border-green-600 p-2 my-2"></i>
              <p className="text-900 font-semibold text-2xl text-center p-2">
                Password Changed!
              </p>
              <p className="text-700 text-lg text-center">
                Your password has been changed successfully.
              </p>
              <Button
                label="Sign in"
                outlined
                onClick={() => setSignInVisible(!signInVisible)}
                className="my-4 w-12rem hover:bg-primary"
              />
            </div>
          </div>
        </div>
      ) : isCodeSent ? (
        <div>
          {!isCodeSubmitted ? (
            <div className="flex justify-content-center">
              <div className="p-3 w-12 sm:w-9 md:w-6">
                <p className="text-900 font-semibold text-2xl text-center p-3">
                  Check Your email
                </p>
                <p className="text-600 ">
                  {" "}
                  Please check your email, You should recieve a confirmation
                  code.
                </p>
                <form onSubmit={submitCode}>
                  <div className="field my-3">
                    <label
                      htmlFor="code"
                      className="block text-900 font-medium mb-2"
                    >
                      Confirmation Code <span className="text-red-500">*</span>
                    </label>
                    <InputText
                      id="code"
                      name="code"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        resetErrors();
                      }}
                      type="text"
                      placeholder="Code"
                      className="w-full text-800"
                      required
                    />
                    {error && (
                      <p className="text-red-500"> Incorrect code !!</p>
                    )}
                    {serverError && (
                      <p className="text-red-500">
                        {" "}
                        Internal server error, Please try again.
                      </p>
                    )}
                  </div>

                  <Button label="Submit" className="w-full my-3" />
                </form>
              </div>
            </div>
          ) : (
            <div className="flex justify-content-center">
              <div className="p-3 w-12 sm:w-9 md:w-6">
                <p className="text-900 font-semibold text-2xl text-center p-3">
                  Create New Password
                </p>
                <form onSubmit={resetPassword}>
                  <div className="field">
                    <label
                      htmlFor="password"
                      className="block text-900 font-medium mb-2"
                    >
                      New Password <span className="text-red-500">*</span>
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
                  <div className="field ">
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
                    {error && (
                      <p className="text-red-500">
                        {" "}
                        Confirmation password dose not match the password.
                      </p>
                    )}
                    {serverError && (
                      <p className="text-red-500">
                        {" "}
                        Internal server error, Please try again.
                      </p>
                    )}
                  </div>
                  <Button label="RESET PASSWORD" className="w-full my-3" />
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-content-center">
          <div className="p-3 w-12 sm:w-9 md:w-6">
            <p className="text-900 font-semibold text-2xl text-center p-3">
              Reset Password
            </p>
            <p className="text-600 ">
              Enter the email associated with your account and we will send an
              email with temporary code to reset your password.
            </p>
            <form onSubmit={sendCode}>
              <div className="field my-3">
                <label
                  htmlFor="email"
                  className="block text-900 font-medium mb-2"
                >
                  Email address <span className="text-red-500">*</span>
                </label>
                <InputText
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    resetErrors();
                  }}
                  type="email"
                  placeholder="Email address"
                  className="w-full text-800"
                  required
                />
                {error && (
                  <p className="text-red-500">
                    {" "}
                    This email dosen`t match any record.
                  </p>
                )}
                {serverError && (
                  <p className="text-red-500">
                    {" "}
                    Failed to send a code to you email.
                  </p>
                )}
              </div>
              <Button label="Send Code" className="w-full my-3" />
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

export default ForgetPassword;
