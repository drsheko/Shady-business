import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useNavigate } from "react-router-dom";

function AgeVerification(props) {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const header = (
    <div>
      {" "}
      <Message
        className="w-full bg-red-500 text-0 border-noround text-center py-3 "
        content={
          <p className="text-0 text-sm md:text-lg uppercase font-bold">
            AGE Verification.
          </p>
        }
      />
    </div>
  );
  const footerContent = (
    <div className="flex flex-column md:flex-row justify-content-center">
      <Button
        label="Yes, I am of legal age"
        icon="pi pi-check"
        onClick={() => setVisible(false)}
        size="small"
        severity="success"
        autoFocus
        className="uppercase m-1"
      />
      <Button
        label="No, I don`t agree"
        icon="pi pi-times"
        severity="danger"
        size="small"
        onClick={() => navigate(-1)}
        className=" uppercase m-1"
      />
    </div>
  );
  return (
    <div>
      <Dialog
        visible={visible}
        header={header}
        position="top"
        className="w-10  sm:w-8 md:w-6"
        closable={false}
        closeOnEscape={false}
        onHide={() => setVisible(false)}
        footer={footerContent}
        draggable={false}
        resizable={false}
        pt={{
          header: {
            className: "p-0",
          },
        }}
      >
        <p className="font-bold text-primary text-xl text-center my-3">
          Vaporesta
        </p>
        <p className="m-0 text-700 text-sm md:text-base font-light">
          The products available on this website{" "}
          <span className="font-semibold text-900">
            are age-restricted and intended for adults of legal smoking age only
          </span>{" "}
          . All orders placed on the website will be verified by an industry
          leading Age Verification software for validation. By entering our
          website, you affirm that you are of legal smoking age in your
          jurisdication and you agree to be Age Verified.
        </p>
      </Dialog>
    </div>
  );
}

export default AgeVerification;
