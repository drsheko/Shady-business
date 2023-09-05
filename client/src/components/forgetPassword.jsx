import React, { useState } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
function ForgetPassword(props) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(null);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isCodeSubmitted, setIsCodeSubmitted] = useState(false);
  const [isStepComplete, setIsStepComplete] = useState(false);
  const onFormChange = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    setForm((form) => ({ ...form, name: value }));
  };
  const sendCode = async() => {
    setIsStepComplete(true);
    try{
        let url;
        let res = await axios.post(url, email);
        if(res.data.success){
            
        }
    }catch(error){

    }
  };
  const submitCode = () => {
    setIsCodeSubmitted(true);
  };
  return (
    <div>
      {isStepComplete ? (
        <di>
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
                <form>
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
                      onChange={(e) => setCode(e.target.value)}
                      type="text"
                      placeholder="Code"
                      className="w-full text-800"
                      required
                    />
                  </div>
                  <Button
                    label="Submit"
                    className="w-full my-3"
                    onClick={submitCode}
                  />
                </form>
              </div>
            </div>
          ) : (
            <div className="flex justify-content-center">
              <div className="p-3 w-12 sm:w-9 md:w-6">
                <p className="text-900 font-semibold text-2xl text-center p-3">
                  Create New Password
                </p>
                <form action="">
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
                  </div>
                  <Button label="RESET PASSWORD" className="w-full my-3" />
                </form>
              </div>
            </div>
          )}
        </di>
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
            <form>
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
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email address"
                  className="w-full text-800"
                  required
                />
              </div>
              <Button
                label="Send Code"
                className="w-full my-3"
                onClick={sendCode}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgetPassword;
