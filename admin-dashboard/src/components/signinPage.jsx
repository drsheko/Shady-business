import React, { useContext, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import axios from "axios";
import { UserContext } from "../App";
function SingInPage(props) {
    const {user, setUser} = useContext(UserContext)
  const [form, setFrom] = useState({ email: "", password: "" , rememberMe:false});
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null)
  const handleFormChange = (e) => {
    setError(null)
    let name = e.target.name;
    let value = e.target.value;
    setFrom((form) => ({ ...form, [name]: value }));
  };
  const submitForm = async(e) =>{
    e.preventDefault();
    setError(null)
    try{
        let url = "http://localhost:3000/api/admin/login";
        let res = await axios.post(url, {
        email: form.email,
        password: form.password,
      });
        if(res.data.success&&res.data.user){
            setUser(res.data.user);
            if(rememberMe){
                localStorage.setItem("SHADY_BUSINESS_ADMIN", JSON.stringify(res.data.user));
            }
        }
    }catch(error){
        setError(error.response.data.error.message)
    }
  }
  return (
    <div class="px-4 py-8 md:px-6 lg:px-8 signin-page flex justify-content-center align-items-center w-full h-full ">
      <div class="w-full lg:w-6 p-4 lg:p-7 surface-card opacity-90 border-round-lg max-w-30rem">
        <div class="text-900 text-2xl font-semibold mb-6 text-center text-primary ">
          Login
        </div>
        <form onSubmit={submitForm}>
            {
                error && <p className="bg-red-500 text-center text-white border-round-lg p-3 font-semibold opacity-100">{error}</p>
            }
        <div className="field">
          <label htmlFor="email" className=" text-900 font-semibold mb-2">
            Email
          </label>
          <InputText
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => handleFormChange(e)}
            placeholder="Email address"
            className=" w-full mb-4 p-inputtext-sm"
            required
          />
        </div>
        <div className="field w-full">
          <label htmlFor="password" className=" text-900 font-semibold mb-2">
            Password
          </label>
          <Password
            id="password"
            name="password"
            value={form.password}
            onChange={(e) => handleFormChange(e)}
            feedback={false}
            toggleMask
            placeholder="Password"
            className=" w-full mb-4 "
            pt={{
                input:{
                    className:"w-full p-inputtext-sm"
                }
            }}
            required
          />
        </div>

        <div className="flex align-items-center justify-content-between mb-6">
          <div className="flex align-items-center">
            <div >
                <Checkbox 
                id="rememberme"
                   checked={rememberMe}
                    onChange ={(e) => setRememberMe(e.checked)}
                    className="mr-2"
                />
              
            </div>
            <label htmlFor="rememberme">Remember me</label>
          </div>
          <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
            Forgot password?
          </a>
        </div>
        <Button label="Login" icon="pi pi-user" type="submit" className="w-full"/> 
        </form>
      </div>
    </div>
  );
}

export default SingInPage;
