import React, { useEffect, useRef } from 'react';
import cornerstone from 'cornerstone-core';
import '../../utils/dicomConfig';

const DicomViewer = ({ imageUrl }) => {
    const elementRef = useRef();

    useEffect(() => {
        cornerstone.enable(elementRef.current);
        cornerstone.loadImage(imageUrl).then(image => {
            cornerstone.displayImage(elementRef.current, image);
        });
    }, [imageUrl]);

    return <div ref={elementRef} style={{ width: '512px', height: '512px' }}></div>;
};

export default DicomViewer;