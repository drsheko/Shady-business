import React, { useEffect } from "react";
import { useState, useContext } from "react";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Rating } from "primereact/rating";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";

import { ProgressSpinner } from "primereact/progressspinner";

import { UserContext } from "../App";

function ReviewForm({ product }) {
  const { user } = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    product: product._id,
    rating: "",
    comment: "",
  });

  const onFormChange = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    setForm({ ...form, [name]: value });
  };

  const onFormSubmit = async () => {
    setIsLoading(true);
    let url = "http://localhost:3000/api/reviews/review/new";
    try {
      var formData = new FormData();
      formData.append("user", user._id);
      formData.append("product", form.product);
      formData.append("rating", form.rating);
      formData.append("comment", form.comment);
      for (let i = 0; i < files.length; i++) {
        formData.append(`file${i + 1}`, files[0]);
      }

      let res = await axios.post(url, formData);
      setIsLoading(false);
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };
  const onTemplateSelect = (e) => {
    let file = e.files[0];
    const isFileDoubled = files.findIndex((ele) => ele.name === file.name);
    if (isFileDoubled === -1) {
      setFiles([...files, file]);
    }
  };

  const onTemplateRemove = (file, callback) => {
    callback();
    let updatedFiles = files.filter((f) => f === file);
    setFiles(updatedFiles);
  };

  useEffect(() => {
    console.log("myfilessss", files);
  }, [files]);

  const onTemplateClear = () => {};
  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;

    return (
      <div
        className={`${className} flex justify-content-between`}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        ADD PHOTO
        <div>
          {chooseButton}

          {cancelButton}
        </div>
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    let unit = props.formatSize.slice(-2);
    let size = props.formatSize.slice(0, -2);
    size = Number(size).toFixed(1);
    return (
      <div className="flex flex-column align-items-start justify-content-start">
        <div
          className="flex flex-column align-items-center justify-content-between "
          style={{ width: "100px" }}
        >
          <div className="relative">
            <img
              alt={file.name}
              role="presentation"
              src={file.objectURL}
              width={100}
              height={100}
              className="w-full"
            />
            <span className="flex flex-column text-left  text-overflow-ellipsis">
              {file.name}
            </span>
            <Badge
              value={"X"}
              severity="danger"
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                cursor: "pointer",
              }}
              onClick={() => onTemplateRemove(file, props.onRemove)}
            ></Badge>
          </div>
        </div>
        <Tag
          value={size + " " + unit}
          severity="warning"
          className="px-3 py-1 "
        />
      </div>
    );
  };
  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-0 p-5"
          style={{
            fontSize: "2em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1em", color: "var(--text-color-secondary)" }}
          className="my-3"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  return (
    <div className="w-full h-full">
      <Button
        className="w-full"
        label="write a review"
        outlined
        onClick={() => setVisible(true)}
      />
      <Dialog
        header="PLEASE SHARE YOUR EXPERIENCE"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ minWidth: "70%" }}
      >
        {
        !user? 
        <div className=" text-center">
          <p className="capitalize font-semibold text-lg my-4 align-self-center">
            members only can review our products
              
              
            </p>
            <div>
              <Button label="log in" className=" uppercase"/>
            </div>
        </div>
        :
        error ? (
          <div className=" text-center">
            <div className="flex justify-content-center">
            <p className="capitalize font-semibold text-lg my-4 align-self-center">
            Oops, something went wrong 
              
              
            </p>
            <Button label="try again" text  onClick={()=>{setError(false)}} className="align-self-center uppercase" />
            </div>
            
            <i
              className="pi pi-times mt-0 p-5 "
              style={{
                fontSize: "2em",
                borderRadius: "50%",
                backgroundColor: "red",
                color: "var(--surface-b)",
              }}
            ></i>
          </div>
        ) : success ? (
          <div className="text-center">
            <p className="capitalize font-semibold text-lg my-4">
              Thanks for your feed back
            </p>
            <i
              className="pi pi-check mt-0 p-5 "
              style={{
                fontSize: "2em",
                borderRadius: "50%",
                backgroundColor: "green",
                color: "var(--surface-b)",
              }}
            ></i>
          </div>
        ) : isLoading ? (
          <div className="card flex justify-content-center">
            <ProgressSpinner />
          </div>
        ) : (
          <div className="m-0 flex flex-column">
            <div className="flex flex-column ">
              <div className="col-12 text-center ">
                <img
                  className="max-w-full max-h-full"
                  src={product.photos[0]}
                  alt={product.name}
                />
                <div className="product-title">
                  <p className="capitalize text-lg font-semibold ">
                    {product.name}
                  </p>
                </div>
              </div>
              <div className=" col-12  ">
                <form action="">
                  <div className="flex flex-column gap-2 mb-3">
                    <label htmlFor="rating">
                      Overall rating<span className="text-pink-600">*</span>
                    </label>
                    <Rating
                      id="rating"
                      name="rating"
                      value={form.rating}
                      onChange={onFormChange}
                      aria-describedby="rating"
                      cancel={false}
                      required
                    />
                  </div>
                  <div className="flex flex-column gap-2 w-full">
                    <label htmlFor="comment ">
                      Comment<span className="text-pink-600">*</span>
                    </label>
                    <InputTextarea
                      id="comment"
                      name="comment"
                      value={form.comment}
                      onChange={onFormChange}
                      rows={8}
                      placeholder="write a comment"
                      aria-describedby="comment"
                      required
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className="upload my-2">
              <Tooltip
                target=".custom-choose-btn"
                content="Choose"
                position="bottom"
              />
              <Tooltip
                target=".custom-cancel-btn"
                content="Clear"
                position="bottom"
              />
              <FileUpload
                name="demo[]"
                url="/api/upload"
                multiple
                accept="image/*"
                maxFileSize={1000000}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                cancelOptions={cancelOptions}
              />
            </div>
            <div className="actions">
              <Button
                label="submit"
                className="uppercase font-bold my-2 w-full"
                onClick={onFormSubmit}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default ReviewForm;
