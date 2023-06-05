import React, { useRef } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export default function AddToCartDialog({visible, setVisible}) {
    const navigate = useNavigate()
    const accept = () => {
        alert('shady')
        navigate('/cart')
    }

    const reject = () => {
        alert('shady')
        navigate('/cart')
    }

    const confirm = () => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept,
            reject
        });
    };

    return (
        
            <ConfirmDialog 
                position='right'
                closable
                closeOnEscape
                visible={visible}
                onHide={()=>setVisible(false)}
                acceptLabel='proceed to checkout'
                rejectLabel='view cart'
                reject={reject}
            />
            
      
    )
}