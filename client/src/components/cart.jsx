import React , {useState, useContext} from 'react';

function Cart(props) {
    return (
        <div className='p-2'>
            <div className="page-title flex ">
                <p className="text-2xl mx-auto">Your Cart (5)</p>
            </div>
            <div className="cart-items flex-column">
                <div className="cart-item">
                    <div className="cart-item-figure">
                        <img src="../src/assets/vape/vape1.avif" alt=""  width='100px' height={"100px"}/>
                    </div>
                    <div className="cart-item-info flex flex-column">
                        <p className="cart-item-category text-lg text-400">
                            POD POCKET
                        </p>
                        <p className="cart-item-name text-xl link">
                        Pod Pocket Disposable (7500 Puffs)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;