import React from 'react';
import { Message } from 'primereact/message';
const Warning = () => {
    return (
        <div className='card '>
             <Message 
              
                className='w-full surface-900 text-0 border-noround text-center' 
                content ={<p className='tet-0 text-sm md:text-lg '  >
                    WARNING: This product contains nicotine. Nicotine is an addictive chemical.
                </p>}
                />
        </div>
    );
};

export default Warning;