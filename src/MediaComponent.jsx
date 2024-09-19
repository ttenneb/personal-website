import React from 'react';

const MediaComponent = ({ src, alt, width, height }) => {
  // Determine the file extension
  const isVideo = /\.(mp4|webm|ogg)$/i.test(src);

  if (isVideo) {
    return (
      <video width={width} height={height} controls loop muted>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  } else {
    return (
      <img src={src} alt={alt} width={width} height={height} />
    );
  }
};

export default MediaComponent;
