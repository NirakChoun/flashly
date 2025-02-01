import React, { useState, useRef } from "react";

const Dropzone = ({ onUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = () => {
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    onUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    onUpload(files);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`flex flex-col justify-center items-center w-2/3 h-48 border-2 border-dashed rounded-lg p-5 cursor-pointer
        ${isDragActive ? "bg-sky-50 border-sky-400" : "border-gray-300"}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={handleClick} // Clicking triggers file selection
    >
      <p
        className={`text-sm ${isDragActive ? "text-sky-800" : "text-gray-400"}`}
      >
        {isDragActive ? (
          "Leave Your File Here"
        ) : (
          <>
            Drag & drop your files here or{" "}
            <span className="text-blue-500 underline hover:text-blue-700">
              click to upload
            </span>
          </>
        )}
      </p>
      {/* Hidden File Input */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default Dropzone;
