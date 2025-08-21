import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { saveArticle } from '../services/dbService';
import '../styles/catalogForm.css'


const CatalogForm = () => {

  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [privateDescription, setPrivateDescription] = useState('');
  const [imageBlob, setImageBlob] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');


  const handleImageUpload = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const imageUrl = URL.createObjectURL(archivo);
      console.log('📸 Imagen subida:', archivo);
      console.log('🔗 URL de vista previa:', imageUrl);
      setImagePreview(imageUrl);
      setImageBlob(archivo); // guardamos el archivo como Blob
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
      privateDescription,
      imageBlob, // guardamos el Blob
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
    <>
    <form onSubmit={handleSubmit} className='form-articulo'>
      <section className='select-file'>


    <div className="image-preview-container">
      {imagePreview ? (
        <img src={imagePreview} alt='Vista previa' />
      ) : (
        <div className="image-placeholder">
          Sube una imagen
        </div>
      )}
    </div>
    <input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  style={{ marginBottom: '1rem' }}
 />

      </section>



      <label htmlFor='description'>Descripcion</label>
      <textarea
      id='description'
      placeholder='Descripcion Completa'
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={5}
      >
      </textarea>
      <label htmlFor='privado'>Anotacion Privada</label>
      <textarea
      id='privado'
      placeholder='Anotaciones privadas'
      value={privateDescription}
      onChange={(e) => setPrivateDescription(e.target.value)}
      rows={5}
      >
      </textarea>

      <button type='submit'>Guardar Articulo</button>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <Link to='/modificar'>Catalog</Link>


    </form>




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
