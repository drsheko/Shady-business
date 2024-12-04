import React, { useContext, useEffect, useRef, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import axios from "axios";
import uuid from "react-uuid";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import template from "./assets/template.jpeg";
import { InputTextarea } from "primereact/inputtextarea";
import { Galleria } from "primereact/galleria";
import { Message } from "primereact/message";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { Calendar } from "primereact/calendar";
import { Messages } from "primereact/messages";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import SlideShow from "./slideShow";

function WarningBanner(props) {
  const [warningBanner, setWarningBanner] = useState(
    props.data || {
      edit: false,
      display: true,
      text: "",
    }
  );
  const saveForm = async () => {
    try {
      let url = "http://localhost:3000/api/project/warningbanner";
      let res = await axios.post(url, { warningBanner });
      if (res.data.success) {
        props.setConfiguration(res.data.project);
        setWarningBanner({ edit: false, text: res.data.project.warningBanner.text, display: res.data.project.warningBanner.display});
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setWarningBanner(props.data);
    console.log("gggggggg", props.data)
  }, [props.data]);
  return (
    <div className="p-2 sm:p-3 w-full bg-white border-round-lg shadow-2">
      <div className="flex flex-column col-12  md:col-10 lg:col-8 px-2 field m-0 w-full">
      <label
          htmlFor="name"
          className="block text-lg text-900 font-semibold mb-2"
        >
          Warning Banner
        </label>
        <div className="flex flex-row justify-content-between align-items-center">
          <p>Show Warning banner</p>
          <InputSwitch
            checked={warningBanner.display}
            onChange={(e) =>
              setWarningBanner((state) => ({ ...state, display: e.value }))
              
            }
            className="mr-1"
          />
        </div>
        
        {warningBanner.display && (
          <div>
            {warningBanner.edit ? (
              <div className="flex flex-row align-items-center justify-content-between w-full my-1 ">
                <InputTextarea
                  id="name"
                  name="name"
                  value={warningBanner.text}
                  onChange={(e) =>
                    setWarningBanner((state) => ({
                      ...state,
                      text: e.target.value,
                    }))
                  }
                  placeholder="warning banner"
                  className="w-full mb-3"
                  disabled={!warningBanner.edit}
                  required
                />
                <Button
                  icon="pi pi-save"
                  text
                  rounded
                  severity="success"
                  onClick={saveForm
                  }
                  className="ml-3 align-self-start"
                />
              </div>
            ) : (
              <div className="flex flex-row align-items-center justify-content-between w-full">
                <Message
                  className="w-10 surface-900 text-0 border-noround text-center p-0"
                  content={
                    <p className="tet-0 text-sm md:text-lg ">
                      {warningBanner.text}
                    </p>
                  }
                />
                <Button
                  icon="pi pi-pencil"
                  text
                  rounded
                  onClick={() =>
                    setWarningBanner((state) => ({ ...state, edit: true }))
                  }
                  className="ml-3 align-self-start"
                />
              </div>
            )}
          </div>
        )}

        <div className="flex flex-row">
          <div className="ml-3"></div>
        </div>
      </div>
    </div>
  );
}

export default WarningBanner;
