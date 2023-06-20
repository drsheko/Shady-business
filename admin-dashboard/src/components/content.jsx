import React from 'react';
import { Route, Routes } from "react-router-dom";
import Coupons from './coupons';
import Home from './home';
import Page1 from './page1';
import Page2 from './page2';
import Products from './products';
function Content(props) {
    return (
        <div className='w-full h-full overflow-y-scroll'>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/coupons' element={<Coupons/>} />
                <Route path='/products' element={<Products/>} />

            </Routes>
        </div>
    );
}

export default Content;