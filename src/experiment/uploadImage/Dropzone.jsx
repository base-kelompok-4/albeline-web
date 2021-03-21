import React from 'react'

import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop, accept, onChange }) => {

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept
  });
  
  const getClassName = (className, isActive) => {
    if (!isActive) return className;
    return `${className} ${className}-active`;
  }

  return (
    <div className={getClassName("dropzone", isDragActive)} {...getRootProps()}>
      <input className="dropzone-input" {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="dropzone-content dropzone-release">Release to drop file here</p>
        ) : (
          <p className="dropzone-content">Drag & drop file here to upload</p>
        )}
      </div>
    </div>
  )
}

export default Dropzone;