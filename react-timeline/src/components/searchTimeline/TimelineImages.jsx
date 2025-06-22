import React from 'react';
import '../../style/componentsStyle/TimelineImages.css';

const TimelineImages = ({ images }) => {
  if (!images || images.length === 0) {
    return null; 
  }

  return (
    <div className="timeline-images-grid">
      {images.map((image, index) => (
        <div key={index} className="timeline-image-item">
          <img src={image.src} alt={image.alt} />
        </div>
      ))}
    </div>
  );
};

export default TimelineImages;