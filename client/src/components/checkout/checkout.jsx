import React from 'react';
import Auth from './auth';
import Shipping from './shipping';

function Checkout(props) {
    return (
        <div>
           <p className="font-bold text-2xl text-center">Checkout</p>
           <div className="flex flex-column sm:flex-row p-1">
            <div className="col-12 sm:col-8">
                <Auth />
                <Shipping/>
            </div>
           </div>
        </div>
    );
}

export default Checkout;