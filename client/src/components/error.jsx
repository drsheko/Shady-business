import React from "react";
import { useNavigate } from "react-router-dom";
function ErrorPage(props) {
    const navigate = useNavigate();
  return (
    <div>
      <div className="block-content">
        <div>
          <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
            <div className="text-center">
              <span className="bg-white text-pink-500 font-bold text-2xl inline-block px-3">
                404
              </span>
            </div>
            <div className="mt-6 mb-5 font-bold text-6xl text-900 text-center">
              Page Not Found
            </div>
            <p className="text-700 text-3xl mt-0 mb-6 text-center">
              Sorry, we could not find the page.
            </p>
            <div className="text-center">
              <button
                aria-label="Go Back"
                className="p-button p-component p-button-text mr-2"
                onClick={()=> navigate(-1)}
              >
                <span className="p-button-icon p-c p-button-icon-left pi pi-arrow-left"></span>
                <span className="p-button-label p-c">Go Back</span>
                <span role="presentation" className="p-ink"></span>
              </button>
              <button
                aria-label="Go to Dashboard"
                className="p-button p-component"
                onClick={()=> navigate('/')}
              >
                <span className="p-button-icon p-c p-button-icon-left pi pi-home"></span>
                <span className="p-button-label p-c">Home</span>
                <span
                  role="presentation"
                  className="p-ink"
                  style={{
                    height: "193px",
                    width: "193px",
                    top: "-76.9px",
                    left: "13.6667px",
                  }}
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
