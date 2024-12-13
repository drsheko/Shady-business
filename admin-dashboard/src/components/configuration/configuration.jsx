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
import ProjectNameForm from "./projectNameForm";
import WarningBanner from "./warningBanner";
function Configuration(props) {
  const [configuration, setConfiguration] = useState({});
  const [projectName, setProjectName] = useState({ edit: false, value: "" });
  const [nameDialog, setNameDialog] = useState(false);
  const [photo, setPhoto] = useState();
  const slideShowRef = useRef();
  const [warningBanner, setWarningBanner] = useState({
    edit: false,
    show: true,
    value: "",
    bgColor: "",
  });
  const [adBanner, setAdBanner] = useState({
    edit: false,
    show: true,
    value: "",
    bgColor: "",
  });
  const [images, setImages] = useState([1, 2]);
  const [imagesFiles, setImagesFiles] = useState([]);

  const changeName = async () => {
    if (projectName.value.trim() === "") {
      return;
    }
    try {
      let url;
      let res = axios.post(url, projectName);
      if (res.data.success && res.data.projectName) {
        setProjectName(res.data.projectName);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // **************** warning banner

  const onPhotoChange = (e, index) => {
    let photoFile = e.target.files[0];
    let photoURL = URL.createObjectURL(photoFile);
    let _images = [...images];
    _images[index] = photoURL;
    setImages(_images);
    let _imagesFiles = [...imagesFiles];
    _imagesFiles[index] = photoFile;
    setImagesFiles(_imagesFiles);
  };
  const removePhoto = (e, index) => {
    if (images.length === 1) return;
    console.log(index);
    let _images = [...images];
    let filteredImages = [];
    _images.map((el, i) => {
      if (i !== index) {
        filteredImages.push(el);
      }
    });
    console.log(filteredImages);
    setImages(filteredImages);
    let _imagesFiles = [...imagesFiles];
    let filteredImagesFiles = [];
    _imagesFiles.map((el, i) => {
      if (i !== index) {
        filteredImagesFiles.push(el);
      }
    });
    console.log(filteredImagesFiles);
    setImagesFiles(filteredImagesFiles);
  };
  const itemTemplate = (item) => {
    return (
      <img
        src={item}
        style={{ minWidth: "100%", height: "400px", objectFit: "fill" }}
      />
    );
  };
  const addPhoto = () => {
    setImages((images) => [...images, template]);
  };
  useEffect(() => {
    console.log("images", images);
    console.log("imagesFiles", imagesFiles);
  }, [images, imagesFiles]);

  useEffect(() => {
    if (slideShowRef.current) {
      console.log("ssssss", slideShowRef.current.isAutoPlayActive());
    }
  }, [slideShowRef]);
  useEffect(() => {
    const getConfiguration = async () => {
      let url = "https://shady-business-server.onrender.com/api/project/configuration";
      try {
        let res = await axios.get(url);
        if (res.data.success && res.data.project) {
          let config = res.data.project;
          setConfiguration({ ...config });
          console.log(config.title);
          setProjectName((state) => ({ ...state, value: config.title }));
          console.log("ssss", config.warningBanner)
          setWarningBanner(config.warningBanner);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getConfiguration();
  }, []);
  return (
    <div className=" card flex flex-column flex-wrap gap-3 align-items-center justify-content-start sm:flex-row  ">
      <ProjectNameForm
        name={projectName.value}
        setConfiguration={setConfiguration}
      />
      <WarningBanner data={warningBanner} setConfiguration={setConfiguration} />

      <SlideShow data={configuration} setConfiguration={setConfiguration}/>
    </div>
  );
}

export default Configuration;
