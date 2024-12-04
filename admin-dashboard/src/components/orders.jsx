import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Toolbar } from "primereact/toolbar";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Carousel } from "primereact/carousel";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Rating } from "primereact/rating";
import { TreeTable } from "primereact/treetable";
import { MultiSelect } from "primereact/multiselect";

function Orders(props) {
  const toast = useRef(null);
  const [orders, setOrders] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [customerDialog, setCustomerDialog] = useState({visible:false, customer:null}) ;
  const onRowExpand = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Product Expanded",
      detail: event.data.name,
      life: 3000,
    });
  };

  const onRowCollapse = (event) => {
    toast.current.show({
      severity: "success",
      summary: "Product Collapsed",
      detail: event.data.name,
      life: 3000,
    });
  };

  const expandAll = () => {
    let _expandedRows = {};

    products.forEach((p) => (_expandedRows[`${p.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };
  const allowExpansion = (rowData) => {
    return rowData.products.length > 0;
  };
  const onCellSelect = (event) => {
    toast.current.show({ severity: 'info', summary: 'Cell Selected', detail: `Name: ${event.value}`, life: 3000 });
};

const onCellUnselect = (event) => {
    toast.current.show({ severity: 'warn', summary: 'Cell Unselected', detail: `Name: ${event.value}`, life: 3000 });
};

//############################## Dialogs ############################
const getActiveCell = (data) => {
switch(data.field){
    case "user.firstName" :
        showCustomer(data);
        break;
        default: showOrderStatus()
}
}
const showCustomer =(data) =>{
    setCustomerDialog({visible:true, customer:data})
}
const showOrderStatus = (data) => {

}
  //################### Body Templates#############################
  const imageBodyTemplate = (data) => {
    return (
      <img
        src={data.option? data.option.photos[0]:data.product.photos[0]}
        width="64px"
        className="shadow-4"
      />
    );
  };
  const priceBodyTemplate = (data) => {
    return (
        <p>
            ${data.price}
        </p>
    )
  }
  const customerBodyTemplate = (data) => {
    return(
        <p className="capitalize white-space-nowrap	">
            {data.user.firstName} {data.user.lastName}
        </p>
    )
  }
  const createAtBodyTemplate = (data) => {
    return(
        <p> {moment(data.createAt).format("MMM Do, YY")}</p>
    )
  }
  const amountBodyTemplate =(data) =>{
    return(
        <p>${data.total}</p>

    )
  }
  const rowExpansionTemplate = (order) => {
    return (
      <div className="p-3">
        <h5>Products for order {order._id}</h5>
        <DataTable value={order.products}>
          <Column field="product.name" header="Product" sortable></Column>
          <Column field="photos" header="Photo" body={imageBodyTemplate} />
          <Column field="quantity" header="Count" sortable></Column>
          <Column field="price" header="Unit Price" body={priceBodyTemplate} sortable></Column>
        </DataTable>
      </div>
    );
  };
  const header = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
      <Button
        icon="pi pi-minus"
        label="Collapse All"
        onClick={collapseAll}
        text
      />
    </div>
  );
  //######## Get Data From DB ###########
  useEffect(() => {
    const getOrders = async () => {
      let url = "http://localhost:3000/api/orders/all";
      try {
        let res = await axios.get(url);
        if (res.data.success && res.data.orders) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "SERVER ERROR",
          detail: "Internal error occured, please try again.",
          life: 3000,
        });
      }
    };
    getOrders();
  }, []);
  return (
    <div className="p-2 sm:p-3 card flex flex-column flex-wrap gap-3 align-items-center justify-content-center sm:flex-row bg-white border-round-lg shadow-2">
      <Toast ref={toast} />
      <DataTable
        value={orders}
        dataKey="_id"
        header={header}
        stripedRows
        className="w-full"
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        onRowExpand={onRowExpand}
        onRowCollapse={onRowCollapse}
        rowExpansionTemplate={rowExpansionTemplate}
        cellSelection selectionMode="single" selection={selectedCell}
                    onSelectionChange={(e) => setSelectedCell(e.value)} metaKeySelection={false}
                    onCellSelect={onCellSelect} onCellUnselect={onCellUnselect}
      >
        <Column expander={allowExpansion} style={{ width: "5rem" }} />

        <Column field="_id" header="Id" sortable />

        <Column field="user.firstName" header="Customer" body={customerBodyTemplate} sortable />
        <Column field="total" header="Amount" body={amountBodyTemplate} sortable />
        <Column field="createAt" header="Create at" body={createAtBodyTemplate} sortable />
        <Column field="status" header="Status" sortable />

        <Column field="shipping.method" header="Shipping" sortable />
      </DataTable>
      <Dialog visible={customerDialog.visible} header="Customer Details" onHide={() =>{setCustomerDialog({visible:false, customer:null})}}>

      </Dialog>
    </div>
  );
}

export default Orders;
