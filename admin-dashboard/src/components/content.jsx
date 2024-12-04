import React from 'react';
import { Route, Routes } from "react-router-dom";
import Brands from './brands';
import Categories from './categories';
import Configuration from './configuration/configuration';
import Coupons from './coupons';
import Dashboard from './dashboard';
import Orders from './orders';

import Products from './products';
import Users from './users';
function Content(props) {
    //w-full h-full  overflow-y-auto shadow-2 border-round-lg bg-white
    return (
        <div className='content w-full'>
            <Routes>
                <Route path='/' element={<Dashboard/>} />
                <Route path='/coupons' element={<Coupons/>} />
                <Route path='/products' element={<Products/>} />
                <Route path='/categories' element={<Categories/>} />
                <Route path='/configuration' element={<Configuration />} />
                <Route path='/orders' element={<Orders/>} />
                <Route path='/brands' element={<Brands />} />
                <Route path='/users' element={<Users/>} />
            </Routes>
        </div>
    );
}

export default Content;