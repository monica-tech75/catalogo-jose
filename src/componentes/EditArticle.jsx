import { useState, useEffect } from 'react';
import { updateArticle, getAllTags, addTag } from '../services/dbService';
import  ImageUploader  from './shared/ImageUploader'

const EditArticle = ({ article, onSave }) => {
    const [description, setDescription] = useState(article.description);
    const [price, setPrice] = useState(article.price);
    const [tags, setTags] = useState(article.tags || []);
    const [imageBlob, setImageBlob] = useState(article.imageBlob || null);
    const [availableTags, setAvailableTags] = useState([]);
    const [newTag, setNewTag] = useState('');

    const categories = ['Fiestas', 'Deporte', 'Figuras', 'Puzzles'];

    const handleTagChange = (e) => {
      const { value, checked } = e.target;
      if (checked) {
        setTags([...tags, value]);
      } else {
        setTags(tags.filter(tag => tag !== value));
      }
    };

    const handleSave = async () => {
      await updateArticle(article.id, {
        description,
        price,
        tags,
        imageBlob
      });
      onSave(); // para recargar la lista
    };

    useEffect(() => {
      const fetchTags = async () => {
        const allTags = await getAllTags();
        setAvailableTags(allTags.map(tag => tag.name));
      }
      fetchTags();
    }, []);

    // Añadir etiquetas desde el input

    const handleAddNewTag = async () => {
      const trimmed = newTag.trim();
      if (availableTags.some(tag => tag.toLowerCase() === trimmed.toLowerCase())) {
        alert('Esta etiqueta ya existe');
        return;
      }
      if (trimmed && !tags.includes(trimmed)) {
        await addTag(trimmed);
        setTags([...tags, trimmed]);
        setNewTag('');
        const updatedTags = await getAllTags();
        setAvailableTags(updatedTags.map(tag => tag.name))
      }
    }

    return (
      <>
        <ImageUploader
        initialImageBlob={imageBlob}
        onImageChange={(blob) => setImageBlob(blob)}
      />
      <div className="edit-form">

<input value={description} onChange={(e) => setDescription(e.target.value)} />
<input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
<div>
  {categories.map(cat => (
    <label key={cat}>
      <input
        type="checkbox"
        value={cat}
        checked={tags.includes(cat)}
        onChange={handleTagChange}
      />
      {cat}
    </label>
  ))}
</div>
<div>
  <input
  type='text'
  placeholder='Añadir etiqueta'
  value={newTag}
  onChange={(e) => setNewTag(e.target.value)}
  />
  <button onClick={handleAddNewTag}>Añadir Etiqueta</button>
</div>
<div>
  <h4>Etiquetas Disponibles</h4>
  {availableTags.map(tag => (
    <label key={tag}>
      <input
      type='checkbox'
      value={tag}
      checked={tags.includes(tag)}
      onChange={handleTagChange}
      />
      {tag}
    </label>
  ))}
</div>


<button onClick={handleSave}>Guardar cambios</button>
</div>
      </>

    );
  };

export default EditArticle
