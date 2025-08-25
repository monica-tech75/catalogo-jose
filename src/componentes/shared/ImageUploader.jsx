import { useState, useEffect } from "react";
import '../../styles/editArticle.css'
const ImageUploader = ({ initialImageBlob, onImageChange }) => {

    const [imageBlob, setImageBlob] = useState(initialImageBlob || null);
    const [imagePreview, setImagePreview] = useState(
      initialImageBlob ? URL.createObjectURL(initialImageBlob) : null
    );

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
          setImageBlob(file);
          onImageChange(file); // comunica el cambio al componente padre
        }
      };

      useEffect(() => {
        return () => {
          if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
          }
        };
      }, [imagePreview]);

      useEffect(() => {
        if (initialImageBlob) {
          const previewUrl = URL.createObjectURL(initialImageBlob);
          setImagePreview(previewUrl);
        }
      }, [initialImageBlob]);
  return (
    <div className="edit-select-img">
    <input type="file" accept="image/*" onChange={handleImageUpload} />
    {imagePreview && (
      <img
        src={imagePreview}
        alt="Vista previa"
        className="edit-img"
      />
    )}
  </div>
  )
}

export default ImageUploader
