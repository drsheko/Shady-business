
import React, { useState, useEffect } from 'react';
import { useResizeListener } from 'primereact/hooks';

export default function useWidth() {
    const [width, setWidth] = useState(0);

    const [bindWindowResizeListener, unbindWindowResizeListener] = useResizeListener({
        listener: (event) => {
            setWidth(event.currentTarget.innerWidth);
        }
    });

    useEffect(() => {
        setWidth(window.innerWidth);
    }, []);

    useEffect(() => {
        bindWindowResizeListener();

        return () => {
            unbindWindowResizeListener();
        };
    }, [bindWindowResizeListener, unbindWindowResizeListener]);

    return width
}
        