import React from 'react';
import { Galleria } from 'primereact/galleria';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import img1 from '../assets/galleria4.jpg'
import img2 from '../assets/galleria6.jpg'
import img3 from '../assets/galleria10.jpg'

function Display(props) {
    const images =[img1,img2,img3];
    const itemTemplate = (item) => {
        return <img src={item}  style={{ minWidth: '100%',maxHeight:'400px', objectFit:"fill"  }} />;
    };
    return (
        <div className="card px-1">
        
        <Galleria  style={{width:'100%', maxHeight:'400px'}} value={images}  showThumbnails={false} showIndicators 
                showIndicatorsOnItem={true} indicatorsPosition='bottom' item={itemTemplate}
                circular autoPlay transitionInterval={4000}

                
                />
    </div>
    );
}

export default Display;