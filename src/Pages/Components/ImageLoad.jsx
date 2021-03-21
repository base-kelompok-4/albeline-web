import React, { useState, useEffect } from 'react';

const ImageLoad = React.memo(({ src, placeholder, alt = "", className = "", styles = {} }) => {
  const [loading, setLoading] = useState(true);
  const [currentSrc, updateSrc] = useState(placeholder);

  useEffect(() => {
    // Start loading original image
    const imageToLoad = new Image();
    imageToLoad.src = src;
    imageToLoad.onload = () => {
      // Saat image terload sepenuhnya, ganti src dan loading ke false
      setLoading(false);
      updateSrc(src);
    }
  }, [src])

  return (
    <img src={currentSrc} style={{ opacity: loading ? 0.6 : 0.9, transition: "opacity .15s linear" }} alt={alt} className={className} style={styles} />
  )
});

export default ImageLoad;