import React from 'react';
import { InputText } from 'primereact/inputtext';

function Search(props) {
    return (
        <div className='card w-full  p-3'>
             <span className="p-input-icon-left w-full">
                <i className="pi pi-search" />
                <InputText placeholder="Search" className='w-full' />
               
            </span>
        </div>
    );
}

export default Search;