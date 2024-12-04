import React, { useContext } from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { UserContext } from '../App';

function Header(props) {
    //className='flex flex-row justify-content-between sticky top-0 z-5 p-2 w-full bg-white	shadow-3'
    const {user} = useContext(UserContext)
    return (
        <div className='fixed h-5rem w-full py-0 px-3 z-5 left-0 top-0  flex justify-content-between align-items-center bg-white shadow-3'>
                 <Button icon="pi pi-align-justify" rounded text raised onClick={() =>props.toggleSidebar()} className="hidden lg:flex" />

                <Button icon="pi pi-align-justify" rounded text raised onClick={()=>props.setMobileSidebarVisible(!props.mobileSidebarVisible)} className="lg:hidden" />
                <p className='mx-auto font-semibold text-xl text-primary'>VAPORESTA</p>
                <Avatar icon="pi pi-user" size="large" shape="circle" pt={{root:{className:"border-circle"}}} style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
        </div>
    );
}

export default Header;