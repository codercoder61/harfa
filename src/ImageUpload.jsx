import { useState } from "react";

function ImageUpload({ images, onImagesChange }) {
  const handleChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.every(f => f.type.startsWith("image/"))) {
      alert("Images only");
      e.target.value = "";
      return;
    }

    onImagesChange(files);
  };

  return (
    <>
      <input type="file" multiple accept="image/*" onChange={handleChange} />
      <p>{images.length} image(s)</p>
    </>
  );
}


export default ImageUpload;
