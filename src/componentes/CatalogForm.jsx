import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { saveArticle } from '../services/dbService';


const CatalogForm = () => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [ selectedTags, setSelectedTags] = useState([]);


  const handleImageUpload = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      // Vista previa
      const imageUrl = URL.createObjectURL(archivo);
      setImagePreview(imageUrl);

      // Base64
      const lector = new FileReader();
      lector.onloadend = () => {
        setImage(lector.result);
        console.log(lector.result);
      };
      lector.readAsDataURL(archivo);
    }
  };
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newArticle = {
      description,
      price,
      image,
      tags: selectedTags,
    }
    await saveArticle(newArticle);
    setSuccessMessage('✅ Artículo guardado correctamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  }
  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedTags([...selectedTags, value]);
    } else {
      setSelectedTags(selectedTags.filter(tag => tag !== value))
    }
  }




  return (
    <>
    <form onSubmit={handleSubmit}>

      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imagePreview && <img src={imagePreview} alt="Vista previa" style={{ width: '200px' }} />}

      <input
      type='text'
      placeholder='descripcion'
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      />
      <input
      type='number'
      placeholder='precio'
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      />
      <span>Euros</span>
      <div>
        <label>Etiquetas</label>
        <div>
          <label><input type="checkbox" value="Fiestas" onChange={handleTagChange}/>Fiestas</label>
          <label><input type="checkbox" value="Deporte" onChange={handleTagChange}/>Deporte</label>
          <label><input type="checkbox" value="Nombres" onChange={handleTagChange}/>Nombres</label>
          <label><input type="checkbox" value="Puzzles" onChange={handleTagChange}/>Puzzles</label>
          <label><input type="checkbox" value="Figuras" onChange={handleTagChange}/>Figuras</label>
        </div>
      </div>
      <button type='submit'>Guardar Articulo</button>
    </form>
    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

    <Link to='/catalogs'>Catalog</Link>

    </>

  )
}

export default CatalogForm


// envolver en un bloque try and catch para manejo de errores
/* try {
  await saveArticle(newArticle);
  setSuccessMessage('✅ Artículo guardado correctamente');
} catch (error) {
  console.error('Error al guardar:', error);
  setSuccessMessage('❌ Error al guardar el artículo');
} */
