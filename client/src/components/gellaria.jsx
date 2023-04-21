import React, { useState, useEffect, useRef } from 'react';
import { Galleria } from 'primereact/galleria';

 function ProductGallery() {
    const [images, setImages] = useState(['vape1.avif', 'vape2.avif', 'vape3.avif', 'vape4.jpg']);
    const [activeIndex, setActiveIndex] = useState(0);    
    const galleria = useRef(null);

  

    const itemTemplate = (item) => {
        return <img src={`../src/assets/vape/${item}`} alt={item} style={{ maxWidth: '100%' , maxHeight:'400px', display: 'block' }} />;
    }

    const thumbnailTemplate = (item) => {
        return <img src={`../src/assets/vape/${item}`} alt={item} style={{ display: 'block' }} />;
    }

    return (
        <div className="card flex flex-column justify-content-center p-3">
            <Galleria ref={galleria} value={images} numVisible={7} style={{ maxWidth: '100%' }}
            activeIndex={activeIndex} onItemChange={(e) => setActiveIndex(e.index)}
            circular  showItemNavigators showThumbnails={false} item={itemTemplate} thumbnail={thumbnailTemplate} />
            <div className="w-full h-full flex flex-wrap row-gap-2 column-gap-2 justify-content-start my-2 " >
                {
                    images && images.map((image, index) => {
                        let imgEl = <img src={`../src/assets/vape/${image}`} alt={image}
                         style={{ cursor: 'pointer' , width:'67.5px' , height:'67.5px'}}
                          onClick={
                            () => {setActiveIndex(index); }
                        } className={index === activeIndex?'active':'opacity-80'} />
                        return (
                            <div className="" key={index}>
                                {imgEl}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ProductGallery ;
        