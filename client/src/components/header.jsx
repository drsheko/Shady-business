import React, { useState } from 'react';
import NavLinks from './navLinks';
import SideNavbar from './sidebar';
import CartOverlay from './cartOverlayPanel';
import SignInSidebar from './sign-in-sidebar';
import Search from './search';
function Header(props) {
    const [visible, setVisible] = useState(false);
    const [search, setSearch] =useState(false);
    const [ signInVisible, setSignInVisible] = useState(false);
    return (
        <>
        <div className=' card flex justify-content-between border-1 border-900 '>
            <p className='font-bold text-3xl md:text-5xl mx-3 align-self-center' >
                Vaporesta
            </p>
            <div className='hidden lg:block '>
                 <NavLinks />
            </div>
            
            <div className='card flex justify-content-between align-items-center text-base py-4 '>
                <i className='pi pi-search mx-2  md:mx-3 cursor-pointer' onClick={()=>setSearch(state=>!state)}></i>
                <CartOverlay/>
                <i className='pi pi-user mx-2  md:mx-3 cursor-pointer' onClick={()=>setSignInVisible(state =>!state)}></i>
                <i className='pi pi-align-justify mx-2  md:mx-3 cursor-pointer lg:hidden' onClick={()=>{setVisible(prevState=>!prevState)}}></i>
            </div>
           
        </div>
         <div>
         <SideNavbar visible={visible} setVisible={setVisible} />
         <SignInSidebar signInVisible={signInVisible} setSignInVisible={setSignInVisible} />
          {search?<Search/> :''}
     </div>
     </>
    );
}

export default Header;