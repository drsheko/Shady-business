import React, { useState , useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Messages } from 'primereact/messages';
        
function SignInSidebar(props) {
  const [checked, setChecked] = useState(false);
  let navigate = useNavigate();
  let msgs = useRef(null)
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    msgs.current.clear()
    try {
      e.preventDefault();
      var res = await axios.post("http://localhost:3000/api/login", {
        email: form.email,
        password: form.password,
      });
      let success = res.data.success;
      if (success) {
        props.setSignInVisible(false);
        var user = res.data.user;
        // Save logged user to local storage
       
      }
    } catch (err) {
     
      msgs.current.show({
        sticky: true, severity: 'error',  
          detail:err.response.data.error.message
      , closable: true
      })
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
        <div className="flex align-items-center justify-content-center">
          <div className="surface-card p-4 shadow-4 border-round w-full ">
            <div className="text-center mb-5">
              <img
                src="/assets/images/blocks/logos/hyper.svg"
                height={50}
                className="mb-3"
              />
              <div className="text-900 text-3xl font-medium mb-3">
                Welcome Back
              </div>
              <span className="text-600 font-medium line-height-3">
                Don't have an account?
              </span>
              <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
                <Link
                  to="/signup"
                  className="no-underline"
                  onClick={() => props.setSignInVisible(false)}
                >
                  Create today!
                </Link>
              </a>
            </div>

            <form onSubmit={handleFormSubmit}>
              
            <Messages ref={msgs}  className='signin-message'/>
              
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
                className="w-full mb-3"
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
                name='password'
                  className="w-full"
                  toggleMask
                  feedback={false}
                  inputStyle={{ width: "100%" }}
                  required
                />
              </div>
              <div className="flex align-items-center justify-content-between mb-6">
                <div className="flex align-items-center">
                  <Checkbox
                    id="rememberme"
                    onChange={(e) => setChecked(e.checked)}
                    checked={checked}
                    className="mr-2"
                  />
                  <label htmlFor="rememberme">Remember me</label>
                </div>
                <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                  Forgot your password?
                </a>
              </div>

              <Button label="Sign In" icon="pi pi-user" type="submit" className="w-full" />
            </form>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}

export default SignInSidebar;
