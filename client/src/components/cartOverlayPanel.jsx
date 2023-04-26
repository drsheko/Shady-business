import React from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { Divider } from "primereact/divider";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
function CartOverlay(props) {
  const op = useRef(null);

  return (
    <div>
      <i
        className="pi pi-shopping-cart mx-2  md:mx-3  p-menuitem-icon cursor-pointer"
        onClick={(e) => op.current.toggle(e)}
      ></i>

      <OverlayPanel ref={op}>
        <div className="card ">
          ssssssssssssddsdsdsadsad
          <Divider type="solid"  layout="horizontal" style={{backgroundColor:'black'}}/>
          <div className="p-2 flex ">
            <Button label="Check out"  className="mx-2"/>
           <Link to='/cart' className="p-button p-component no-underline font-semibold"> view cart</Link> 
          </div>
        </div>
      </OverlayPanel>
    </div>
  );
}

export default CartOverlay;
