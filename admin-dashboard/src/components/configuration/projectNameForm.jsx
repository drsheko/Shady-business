import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import axios from "axios";
function ProjectNameForm(props) {
  const [projectName, setProjectName] = useState({
    edit: false,
    value: props.name,
  });

  const saveForm = async () => {
    try {
      let url = "https://shady-business-server.onrender.com/api/project/name";
      let res = await axios.post(url, { projectName: projectName.value });
      if (res.data.success) {
        props.setConfiguration(res.data.project);
        setProjectName({ edit: false, value: res.data.project.title });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
setProjectName((state) =>({...state, value:props.name}))
  },[props.name])
  return (
    <div className="p-2 sm:p-3 w-full bg-white border-round-lg shadow-2">
      <div className="flex flex-column col-12  md:col-10 lg:col-8  field m-0 w-full">
        <label htmlFor="name" className="block text-lg  font-semibold mb-2">
          Project Name
        </label>
        <div className="flex flex-row">
          {projectName.edit ? (
            <div className="flex flex-row align-items-center justify-content-between w-full my-1 ">
              <InputText
                id="name"
                name="name"
                value={projectName.value}
                onChange={(e) =>
                  setProjectName((state) => ({
                    ...state,
                    value: e.target.value,
                  }))
                }
                placeholder="Project Name"
                className=" p-inputtext-md"
                disabled={!projectName.edit}
                required
              />
              <Button
                icon="pi pi-save"
                text
                rounded
                onClick={saveForm}
                severity="success"
                className="ml-3"
              />
            </div>
          ) : (
            <div className="flex flex-row align-items-center justify-content-between w-full">
              <p className="text-primary font-bold text-lg ml-3">
                {projectName.value}{" "}
              </p>
              <Button
                icon="pi pi-pencil"
                text
                rounded
                onClick={() =>
                  setProjectName((state) => ({ ...state, edit: true }))
                }
                className="ml-3"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectNameForm;
