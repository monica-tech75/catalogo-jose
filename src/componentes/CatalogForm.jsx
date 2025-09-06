import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { saveArticle } from '../services/dbService';
import '../styles/catalogForm.css'


const CatalogForm = () => {

  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [privateDescription, setPrivateDescription] = useState('');
  const [title, setTitle] = useState('');
  const [imageBlobs, setImageBlobs] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');


  const handleImageUpload = (e) => {
    try {
      const nuevosArchivos = Array.from(e.target.files).slice(0, 3 - imageBlobs.length);
      const nuevasPreviews = nuevosArchivos.map(file => URL.createObjectURL(file));

      setImageBlobs(prev => [...prev, ...nuevosArchivos]);
      setImagePreviews(prev => [...prev, ...nuevasPreviews]);
    } catch (error) {
      console.error('❌ Error al subir imágenes:', error);
      alert('Hubo un problema al cargar las imágenes.');
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newArticle = {
      title,
      description,
      privateDescription,
      imageBlobs
    };
    try {
      await saveArticle(newArticle);
      setSuccessMessage('✅ Artículo guardado correctamente');

      setTimeout(() => {
        setSuccessMessage('');
        navigate('/modificar')
      }, 2000);
    } catch (error) {
      console.error('Error al guardar', error);
      setSuccessMessage('❌ Error al guardar el artículo');
    }
  };


  return (
    <form onSubmit={handleSubmit} className='form-articulo'>
      <section className='select-file'>


      <div className="image-preview-container">
  {imagePreviews.length > 0 ? (
    imagePreviews.map((url, index) => (
      <img key={index} src={url} alt={`Vista previa ${index + 1}`} />
    ))
  ) : (
    <div className="image-placeholder">Sube hasta 3 imágenes</div>
  )}
</div>


    <div className='buttons-form'>
    <input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  style={{ marginBottom: '1rem' }}
 />
 <button type='submit'>Guardar Articulo</button>
    </div>
      </section>

      <label htmlFor='title' className='sr-only'>Titulo</label>
      <input
      name='title'
      id='title'
      placeholder='Titulo'
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      />
      <label
      htmlFor='description'
      className='sr-only'
      >Descripcion</label>
      <textarea
      id='description'
      placeholder='Descripcion Completa'
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={2}
      >
      </textarea>
      <label
      htmlFor='privado'
      className='sr-only'
      >Anotacion Privada</label>
      <textarea
      id='privado'
      placeholder='Anotaciones privadas'
      value={privateDescription}
      onChange={(e) => setPrivateDescription(e.target.value)}
      rows={2}
      >
      </textarea>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

    </form>

  )
}

export default CatalogForm
