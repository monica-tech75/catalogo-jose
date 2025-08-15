import React from 'react'
import { useState } from 'react';
import { updateArticle } from '../services/dbService';

const EditArticle = ({ article, onSave }) => {
    const [description, setDescription] = useState(article.description);
    const [price, setPrice] = useState(article.price);
    const [tags, setTags] = useState(article.tags || []);

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
        tags
      });
      onSave(); // para recargar la lista
    };

    return (
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
        <button onClick={handleSave}>Guardar cambios</button>
      </div>
    );
  };

export default EditArticle
