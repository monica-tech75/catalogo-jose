import { useState, useEffect } from 'react';
import { updateArticle, getAllTags, addTag } from '../services/dbService';
import ImageUploader from './shared/ImageUploader';
import '../styles/editArticle.css'

const EditArticle = ({ article, onSave }) => {
const [title, setTitle] = useState(article.title || '');
const [description, setDescription] = useState(article.description || '');
const [privateDescription, setPrivateDescription] = useState(article.privateDescription || '');
const [tags, setTags] = useState(article.tags || []);
const [imageBlobs, setImageBlobs] = useState(
  Array.isArray(article.imageBlobs)
    ? article.imageBlobs
    : article.imageBlob
      ? [article.imageBlob]
      : []
);
const [availableTags, setAvailableTags] = useState([]);
const [newTag, setNewTag] = useState('');


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
title,
description,
privateDescription,
tags,
imageBlobs
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
<form className='edit-form' onSubmit={(e) => {
  e.preventDefault();
  handleSave();
}}
>
<div className="title-description">
  <ImageUploader initialImageBlobs={imageBlobs} onImageChange={(blobs)=> setImageBlobs(blobs)}
    />

      <input value={title} onChange={(e) => setTitle(e.target.value)} name='title' id='title'/>

      <textarea
      name='descripcion'
      value={description}
      onChange={(e)=> setDescription(e.target.value)}
      ></textarea>

      <textarea
      name='descripcion-privada'
      value={privateDescription}
      onChange={(e)=> setPrivateDescription(e.target.value)}></textarea>
      </div>

      <section className='tag-list'>
      <h4>Etiquetas Disponibles</h4>
  <div className="tag-chips">
    {availableTags.map(tag => {
      const isSelected = tags.includes(tag);

      // Simular el evento que handleTagChange espera
      const fakeEvent = {
        target: {
          value: tag,
          checked: !isSelected
        }
      };

      return (
        <span
          key={tag}
          className={`tag-chip ${isSelected ? 'selected' : ''}`}
          onClick={() => handleTagChange(fakeEvent)}
        >
          {tag}
        </span>
      );
    })}
  </div>
      <div className='edit-tags'>
        <input
        id='addTag'
        name='addTag'
        type='text'
         placeholder='Añadir etiqueta'
         value={newTag}
         onChange={(e)=> setNewTag(e.target.value)}
        />
        <button onClick={handleAddNewTag}>Añadir Etiqueta</button>
      </div>

      </section>


      <button type="submit">Guardar cambios</button>

    </form>
</>

);
};

export default EditArticle
