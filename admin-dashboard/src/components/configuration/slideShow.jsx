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


function SlideShow(props) {
    const [photo, setPhoto] = useState();
    const slideShowRef = useRef();
    const [images, setImages] = useState([template, template]);
    const [imagesFiles, setImagesFiles] = useState([]);
    const [imagesRef, setImagesRef] = useState([]);
    const [links, setLinks] = useState(["1","2"]);

    const saveSlideShow =async() =>{
      try{
        let url = "http://localhost:3000/api/project/slideshow";
        let res = await axios.postForm(url,{links,images, files:imagesFiles});
        console.log(res)

      }catch(error){
        console.log(error)
      }
    }
    useEffect(()=>{
      console.log("files", imagesFiles)
      console.log("images" , images)
    },[imagesFiles, images])
    const onPhotoChange = (e, index) => {
        let photoFile = e.target.files[0];
        let photoURL = URL.createObjectURL(photoFile);
        let _images = [...images];
        _images[index] = photoURL;
        setImages(_images);
        let _imagesFiles = [...imagesFiles];
        _imagesFiles[index] = photoFile;
        setImagesFiles(_imagesFiles);
        let _imagesRef = [...imagesRef];
        _imagesRef[index] = "file";
        
        setImagesRef(_imagesRef)
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
        setImagesRef((state) =>(state.filter((el,ind) => {ind !==index})))
      };
      const itemTemplate = (item) => {
        return (
          <img
          className="max-h-400 min-w-full"
            src={item}
            style={{ Width: "100%", height: "400px", objectFit: "fill" }}
          />
        );
      };
      const addPhoto = () => {
        setImages((images) => [...images, template]);
      };
      useEffect(() =>{
        let _data = props.data.mainDisplay;
        if(_data){
          let _images = [];
          let _links = [];
          let _imagesRef =[];
          _data.map((el) =>{
            _images.push(el.photo);
            _links.push(el.link);
           _imagesRef.push("link")
          });
          setImages(_images);
          setLinks(_links);
          setImagesRef(_imagesRef)
        }
        
      },[props.data])
    
      useEffect(() => {
        if (slideShowRef.current) {
        }
      }, [slideShowRef]);
      useEffect(()=>{
        console.log(imagesRef)
      },[imagesRef])
    return (
        <div  className="p-2 sm:p-3 w-full bg-white border-round-lg shadow-2">
        <p className="text-lg font-semibold">Slide show</p>
        <Galleria
          style={{ width: "100%", height: "400px", maxWidth: "100%" }}
          value={images}
          showThumbnails={false}
          showIndicators
          showIndicatorsOnItem={true}
          indicatorsPosition="bottom"
          item={itemTemplate}
          circular
          autoPlay={true}
          transitionInterval={4000}
          ref={slideShowRef}
          pt={{
            itemWrapper: {
              className: "w-full h-full w-max-full",
            },
            itemContainer: {
              className: "w-full h-full w-max-full",
            },
            item: {
                className: "w-full h-full w-max-full",
              },
          }}
        />
        <div className="images-container my-3">
          
          {images && images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {images.map((image, index) => {
                return (
                  <div
                    key={uuid()}
                    className="flex flex-column justify-content-start align-items-start m-1 shadow-5 p-2 border-round-lg"
                  >
                    <div className="relative">
                      <div
                        onClick={() => removePhoto(image, index)}
                        className="border-circle surface-100 border-1 border-800 text-red-500 cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 flex justify-content-center align-items-center h-2rem w-2rem absolute"
                        style={{ right: "-15px", top: "-15px" }}
                      >
                        <i className="pi pi-times"></i>
                      </div>
                      <img
                        src={image}
                        alt=""
                        width={100}
                        height={50}
                        className=" block m-auto pb-3"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = template;
                        }}
                      />
                    </div>
                    <div className="w-full text-center">
                      <label htmlFor={`uploadPhoto${index}`}>
                        <span className="p-button p-button-raised border-round-lg hover:bg-green-500 font-bold p-2">
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
                  </div>
                );
                
              })}
              <Button icon="pi pi-plus" onClick={addPhoto} name="Add Slide" className="flex flex-column justify-content-center align-items-center m-1 shadow-5 p-2 border-round-lg"  severity="success"/> 
            </div>
          )}
          
          <Button icon="pi pi-plus" onClick={saveSlideShow}  className="w-full justify-content-center"> save Slide </Button>
        </div>
        </div>
    );
}

export default SlideShow;