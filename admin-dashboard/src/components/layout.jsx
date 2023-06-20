import React, { useState } from 'react';
import Content from './content';
import Header from './header';
import Navigation from './navigation';
import SlidebarNavigation from './slidebarNavigation';
import useWidth from '../tools/useWidth';
function Layout(props) {
    const width = useWidth()
    const [sidebarVisible, setSidebarVisible] =useState(false)
    return (
        <div className='flex flex-row w-full p-0'>
           {
            sidebarVisible && <div className=''><Navigation /></div>
           } 
            <div className='flex flex-column h-screen w-full'>
                <Header  visible={sidebarVisible} setVisible={setSidebarVisible}/>
                <Content/>
            </div>
            {
                width<990 &&<SlidebarNavigation visible={sidebarVisible} setVisible={setSidebarVisible} />
            }
            
        </div>
    );
}

export default Layout;