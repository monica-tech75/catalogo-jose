import { useState, useEffect } from 'react';
import { updateArticle, getAllTags, addTag } from '../services/dbService';
import ImageUploader from './shared/ImageUploader';
import '../styles/editArticle.css'

const EditArticle = ({ article, onSave }) => {
const [title, setTitle] = useState(article.title);
const [description, setDescription] = useState(article.description);
const [privateDescription, setPrivateDescription] = useState(article.privateDescription);
const [tags, setTags] = useState(article.tags || []);
const [imageBlob, setImageBlob] = useState(article.imageBlob || null);
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
<form className='edit-form' onSubmit={(e) => {
  e.preventDefault();
  handleSave();
}}
>
<div className="title-description">
  <ImageUploader initialImageBlob={imageBlob} onImageChange={(blob)=> setImageBlob(blob)}
    />

      <label htmlFor='title'>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} name='title' id='title'/>

      <textarea value={description} onChange={(e)=> setDescription(e.target.value)}></textarea>
      <textarea value={privateDescription} onChange={(e)=> setPrivateDescription(e.target.value)}></textarea>
      </div>

      <section className='tag-list'>
      <div className='tags-availables'>
        <h4>Etiquetas Disponibles</h4>
        {availableTags.map(tag => (
        <label key={tag}>
          <input type='checkbox' value={tag} checked={tags.includes(tag)} onChange={handleTagChange} />
          {tag}
        </label>
        ))}
      </div>
      <div className='edit-tags'>
        <input type='text' placeholder='Añadir etiqueta' value={newTag} onChange={(e)=> setNewTag(e.target.value)}
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
