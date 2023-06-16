import React from 'react';
import { Route, Routes } from "react-router-dom";
import Coupons from './coupons';
import Page1 from './page1';
import Page2 from './page2';
function Content(props) {
    return (
        <div className='w-full h-full'>
            <Routes>
                <Route path='/coupons' element={<Coupons/>} />
                <Route path='/page2' element={<Page2/>} />

            </Routes>
        </div>
    );
}

export default Content;