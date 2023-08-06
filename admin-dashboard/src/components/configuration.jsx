import React, { useContext, useEffect, useRef, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import axios from "axios";
import uuid from 'react-uuid';
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import template from "../assets/template.jpeg";
import { InputTextarea } from "primereact/inputtextarea";
import { Galleria } from "primereact/galleria";

import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { Calendar } from "primereact/calendar";
import { Messages } from "primereact/messages";
import { Toast } from "primereact/toast";

function Configuration(props) {
  const [projectName, setProjectName] = useState({ edit: false, value: "" });
  const [photo, setPhoto] = useState();
  const [warningBanner, setWarningBanner] = useState({
    edit: false,
    value: "",
  });
  const [images, setImages] = useState([1, 2]);
  const [imagesFiles, setImagesFiles] = useState([]);
  const onPhotoChange = (e, index) => {
    console.log("index", index);
    let photoFile = e.target.files[0];
    let photoURL = URL.createObjectURL(photoFile);
    let _images = [...images];
    _images[index] = photoURL;
    setImages(_images);
    let _imagesFiles = [...imagesFiles];
    _imagesFiles[index] = photoFile;
    setImagesFiles(_imagesFiles);
  };
  const removePhoto = (e,index) =>{
    if(images.length===1) return;
    console.log(index)
    let _images = [...images];
    let filteredImages = [] ;
    _images.map((el,i) => {
        if(i!== index) {
            filteredImages.push(el)
        }
    });
    console.log(filteredImages)
    setImages(filteredImages);
    let _imagesFiles = [...imagesFiles];
    let filteredImagesFiles = [] ;
    _imagesFiles.map((el,i) => {
        if(i!== index) {
            filteredImagesFiles.push(el)
        }
    });
    console.log(filteredImagesFiles)
    setImagesFiles(filteredImagesFiles);
  }
  const itemTemplate = (item) => {
    return (
      <img
        src={item}
        style={{ minWidth: "100%", maxHeight: "400px", objectFit: "fill" }}
      />
    );
  };
  const addPhoto = () => {
    setImages((images) => [...images, 0]);
  };
  useEffect(() => {
    console.log("images", images);
    console.log("imagesFiles", imagesFiles);
  }, [images, imagesFiles]);

  return (
    <div className="card shadow-3 p-3 ">
      <div className="flex flex-column col-12 sm:col-6 px-2 field m-0 ">
        <label
          htmlFor="name"
          className="block text-lg text-900 font-semibold mb-2"
        >
          Project Name
        </label>
        <div className="flex flex-row">
          <InputText
            id="name"
            name="name"
            value={projectName.value}
            onChange={(e) =>
              setProjectName((state) => ({ ...state, value: e.target.value }))
            }
            placeholder="Project Name"
            className="w-full mb-3"
            disabled={!projectName.edit}
            required
          />
          <div className="ml-3">
            <Button
              icon="pi pi-pencil"
              text
              onClick={() =>
                setProjectName((state) => ({ ...state, edit: true }))
              }
              className={`${projectName.edit ? "hidden" : "block"}`}
            />
            <Button
              icon="pi pi-save"
              text
              onClick={() =>
                setProjectName((state) => ({ ...state, edit: false }))
              }
              className={`${!projectName.edit ? "hidden" : "block"}`}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-column col-12 sm:col-6 px-2 field m-0 ">
        <label
          htmlFor="name"
          className="block text-lg text-900 font-semibold mb-2"
        >
          Warning Banner
        </label>
        <div className="flex flex-row">
          <InputTextarea
            id="name"
            name="name"
            value={warningBanner.value}
            onChange={(e) =>
              setWarningBanner((state) => ({ ...state, value: e.target.value }))
            }
            placeholder="Project Name"
            className="w-full mb-3"
            disabled={!warningBanner.edit}
            required
          />
          <div className="ml-3">
            <Button
              icon="pi pi-pencil"
              text
              onClick={() =>
                setWarningBanner((state) => ({ ...state, edit: true }))
              }
              className={`${warningBanner.edit ? "hidden" : "block"}`}
            />
            <Button
              icon="pi pi-save"
              text
              onClick={() =>
                setWarningBanner((state) => ({ ...state, edit: false }))
              }
              className={`${!warningBanner.edit ? "hidden" : "block"}`}
            />
          </div>
        </div>
      </div>
      <div>
        <p className="">Display</p>

        <div className="images-container">
          {images && images.length > 0 && (
            <div className="flex gap-3">
              {images.map((image, index) => {
                return (
                  <div
                    key={uuid()}
                    className="flex flex-column justify-content-start align-items-start m-1"
                  >
                    <div className="relative">
                      <div
                      onClick={() => removePhoto(image, index)}
                        className="border-circle surface-100 border-1 border-800 text-red-500 cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 flex justify-content-center align-items-center h-2rem w-2rem absolute"
                        style={{ right: "-10px", top: "-10px" }}
                      >
                        <i className="pi pi-times"></i>
                      </div>
                      <img
                        src={image}
                        alt=""
                        width={200}
                        height={100}
                        className=" block m-auto pb-3"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = template;
                        }}
                      />
                    </div>

                    <label htmlFor={`uploadPhoto${index}`}>
                      <span className="p-button p-button-raised border-round-lg hover:bg-green-500 font-bold">
                        {" "}
                        <i className="pi pi-upload fonst-bold mr-1">
                          {" "}
                          Photo-{index + 1}
                        </i>{" "}
                      </span>
                    </label>
                    <input
                      id={`uploadPhoto${index}`}
                      type="file"
                      onChange={(e) => onPhotoChange(e, index)}
                      style={{ display: "none" }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Button label="Add Image" onClick={addPhoto} />
    </div>
  );
}

export default Configuration;
