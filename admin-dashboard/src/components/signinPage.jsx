import React from "react";
function SingInPage(props) {
  return (
    
        <div
          class="px-4 py-8 md:px-6 lg:px-8 signin-page flex justify-content-center align-items-center w-full h-full"
        >
          
            <div class="w-full lg:w-6 p-4 lg:p-7 surface-card opacity-80">
              <div class="text-900 text-2xl font-medium mb-6">Login</div>
              <label for="email3" class="block text-900 font-medium mb-2">
                Email
              </label>
              <input
                id="email3"
                type="text"
                placeholder="Email address"
                class="p-inputtext p-component w-full mb-4"
              />
              <label for="password3" class="block text-900 font-medium mb-2">
                Password
              </label>
              <input
                id="password3"
                type="password"
                placeholder="Password"
                class="p-inputtext p-component w-full mb-4"
              />
              <div class="flex align-items-center justify-content-between mb-6">
                <div class="flex align-items-center">
                  <div id="rememberme3" class="p-checkbox p-component mr-2">
                    <div class="p-hidden-accessible">
                      <input type="checkbox" />
                    </div>
                    <div class="p-checkbox-box"></div>
                  </div>
                  <label for="rememberme3">Remember me</label>
                </div>
                <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                  Forgot password?
                </a>
              </div>
              <button aria-label="Login" class="p-button p-component w-full">
                <span class="p-button-icon p-c p-button-icon-left pi pi-user"></span>
                <span class="p-button-label p-c">Login</span>
                <span
                  role="presentation"
                  class="p-ink"
                  style={{height: "527.2px", width:" 527.2px"}}
                ></span>
              </button>
            </div>
          </div>
  );
}

export default SingInPage;
