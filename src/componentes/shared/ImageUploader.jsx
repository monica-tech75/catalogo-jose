import { useState, useEffect } from "react";
import '../../styles/editArticle.css';
import { FcGallery } from "react-icons/fc";

const ImageUploader = ({ initialImageBlobs, onImageChange }) => {

  const validInitialBlobs = Array.isArray(initialImageBlobs)
  ? initialImageBlobs
  : initialImageBlobs
    ? [initialImageBlobs]
    : [];

    const [imageBlobs, setImageBlobs] = useState(validInitialBlobs);
    const [imagePreviews, setImagePreviews] = useState(
      validInitialBlobs.map(blob => URL.createObjectURL(blob))
    );
    const MAX_IMAGES = 3;
    const [warning, setWarning] = useState('');

    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      const newBlobs = files.filter(file => file.type.startsWith('image/'));

      const combinedBlobs = [...imageBlobs, ...newBlobs];

      if (combinedBlobs.length > MAX_IMAGES) {
        setWarning(`⚠️ Máximo de ${MAX_IMAGES} imágenes alcanzado`);
        const limitedBlobs = combinedBlobs.slice(0, MAX_IMAGES);
        const limitedPreviews = limitedBlobs.map(blob => URL.createObjectURL(blob));

        imagePreviews.forEach(url => URL.revokeObjectURL(url));

        setImageBlobs(limitedBlobs);
        setImagePreviews(limitedPreviews);
        onImageChange(limitedBlobs);
      } else {
        setWarning('');
        const newPreviews = newBlobs.map(blob => URL.createObjectURL(blob));
        setImageBlobs(combinedBlobs);
        setImagePreviews([...imagePreviews, ...newPreviews]);
        onImageChange(combinedBlobs);
      }
    };

    const handleReplaceImage = (e, indexToReplace) => {
      const file = e.target.files[0];
      if (!file || !file.type.startsWith('image/')) return;

      const newBlob = file;
      const newPreview = URL.createObjectURL(newBlob);

      // Limpia la URL anterior
      URL.revokeObjectURL(imagePreviews[indexToReplace]);

      const updatedBlobs = [...imageBlobs];
      const updatedPreviews = [...imagePreviews];

      updatedBlobs[indexToReplace] = newBlob;
      updatedPreviews[indexToReplace] = newPreview;

      setImageBlobs(updatedBlobs);
      setImagePreviews(updatedPreviews);
      onImageChange(updatedBlobs);
    };



    useEffect(() => {
      return () => {
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
      };
    }, [imagePreviews]);

    useEffect(() => {
      const validBlobs = Array.isArray(initialImageBlobs)
        ? initialImageBlobs
        : initialImageBlobs
          ? [initialImageBlobs]
          : [];

      const previews = validBlobs.map(blob => URL.createObjectURL(blob));
      setImageBlobs(validBlobs);
      setImagePreviews(previews);
    }, [initialImageBlobs]);
  return (
    <div className="edit-select-img">
      <header>
      <h1>Editor de Articulos</h1>
      <label
      htmlFor="upload"
      className="custom-upload"
      >
        <FcGallery />  Max 3 Imagenes
        </label>
      </header>

    <input
    type="file"
    id="upload"
    className="hidden-upload"
    accept="image/*"
    multiple onChange={handleImageUpload} />
    {warning && <p className="warning-msg">{warning}</p>}
    <div className="preview-gallery">
  {imagePreviews.map((url, index) => {
    const inputId = `upload-${index}`;
    return (
      <div key={index} className="preview-item">
      <img src={url} alt={`Vista previa ${index + 1}`} className="edit-img" />
      <label
      htmlFor={inputId}
      className="custom-upload"
      >
        <FcGallery /> Cambiar
        </label>
      <input
        type="file"
        id={inputId}
        className="hidden-upload"
        accept="image/*"
        onChange={(e) => handleReplaceImage(e, index)}
      />
    </div>
    )
  })}
</div>

  </div>
  )
}

export default ImageUploader
