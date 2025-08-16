import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllArticles } from '../services/dbService';
import { Link } from 'react-router-dom'
import '../styles/catalog.css'
import EditArticle from '../componentes/EditArticle';

const Catalogs = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const [editingArticle, setEditingArticle] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const categories = [ 'Todos', 'Fiestas', 'Deporte', 'Nombres', 'Puzzles', 'Figuras'];

    useEffect(() => {
      const fetchArticles = async () => {
        const items = await getAllArticles();
        setArticles(items);
      };
      fetchArticles();
    }, []);

    const filteredArticles = selectedCategory === 'Todos'
    ? articles
    : articles.filter(item => Array.isArray(item.tags) && item.tags.includes(selectedCategory));

    const handleSave = async () => {
      const updatedItems = await getAllArticles();
      setArticles(updatedItems);
      setEditingArticle(null);
      setIsEditing(false);
    };

    console.log(articles);

  return (
    <>
    <div className='catalogs-container'>
        <h3><Link to="/">Inicio</Link></h3>
        <h2>Catalogs</h2>
        {/* Dropdown de categorias */}
        <div className="dropdown-container">
          <label htmlFor="category-select">Filtrar por categoria</label>
          <select
          name="category-select"
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          >
          {categories.map((cat) => (
            <option key={cat} value={cat} >{cat}</option>

          ))}
          </select>
        </div>
        <div className="gallery">
  {filteredArticles.map((item) => {
    if (item.imageBlob) {
      try {
        const imageUrl = URL.createObjectURL(item.imageBlob);
        console.log('✅ Imagen encontrada:', item.description, imageUrl);
        return (
          <div key={item.id} className="card">
            <img
              src={imageUrl}
              alt="Artículo"
              style={{ width: '150px' }}
            />
            <p>{item.description}</p>
          <h3>{item.price} €</h3>
        {/*   <button onClick={() => {
            setEditingArticle(item)
            setIsEditing(true)
          }} >Editar</button> */}
          <button onClick={() => navigate(`/editar/${item.id}`)}>Editar</button>
          </div>
        );
      } catch (error) {
        console.error('❌ Error al crear URL de imagen:', error);
      }
    } else {
      console.warn('⚠️ Artículo sin imagen:', item.description);
      return (
        <div key={item.id} className="card">
          <p>Sin imagen disponible</p>
        </div>
      );
    }
  })}
</div>


    </div>
    {isEditing && editingArticle && (
      <EditArticle
      article={editingArticle}
      onSave={handleSave}
      />
    )}
    </>

  )
}

export default Catalogs
