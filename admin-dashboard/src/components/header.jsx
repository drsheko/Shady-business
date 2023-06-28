import React from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';

function Header(props) {
    return (
        <div className='flex flex-row justify-content-between sticky top-0 z-5 p-2 w-full surface-100	'>
                <Button icon="pi pi-align-justify" rounded text raised onClick={()=>props.setVisible(!props.visible)} />
                <Avatar label="V" size="large" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" />

        </div>
    );
}

export default Header;