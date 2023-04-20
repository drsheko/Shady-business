import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';

function ReviewSortingBtn(props) {
    const menu = useRef(null);

    const items = [
        {
            label:'Highest ratings',
            command:(e) =>{
               props.setSortKey('!rating')
            }
        },
        {
          label:'lowest ratings',
          command:(e) => {
            props.setSortKey('rating')
          }
        },
        {
            label:'Most recent',
            command:(e) => {
                props.setSortKey('!date')
            }
        }
    ];

    return (
        <div className=" flex ">
            <Menu model={items} popup ref={menu} />
            <Button  icon="pi pi-sliders-h"
            className='my-auto'
                outlined onClick={(e) => menu.current.toggle(e)} />
        </div>
    )
}

export default ReviewSortingBtn;