import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addArticleToCatalog, getAllArticles } from '../services/dbService';
import { deleteArticleById } from '../services/dbService';
import { Link } from 'react-router-dom'
import '../styles/catalog.css'
import EditArticle from '../componentes/EditArticle';
import { getAllCatalogs } from '../services/dbService';

const Catalogs = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const [editingArticle, setEditingArticle] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [catalogs, setCatalogs] = useState([]);
    const [selectedCatalog, setSelectedCatalog] = useState({});

    const categories = [ 'Todos', 'Fiestas', 'Deporte', 'Nombres', 'Puzzles', 'Figuras'];

    useEffect(() => {
      const fetchArticles = async () => {
        const items = await getAllArticles();
        setArticles(items);
      };

      const fetchCatalogs = async () => {
        const cats = await getAllCatalogs();
        setCatalogs(cats)
      }
      fetchArticles();
      fetchCatalogs();
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

    const handleDelete = async (item) => {
      const result = await deleteArticleById(item.id);
      alert(result.message);

      if (result.success) {
        setArticles(prev => prev.filter(article => article.id !== item.id));
      }
    };


  return (
    <>
    <div className='catalogs-container'>
        <h3><Link to="/">Inicio</Link></h3>
        <h2>Crear Catalogos</h2>
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
            <select
            value={selectedCatalog[item.id] || ''}
            onChange={(e) => setSelectedCatalog(prev => ({...prev, [item.id]: e.target.value}))}
            >
              <option value=''>Selecciona catalogo</option>
              {catalogs.map(cat => (
                <option value={cat.id} key={cat.id}>{cat.name}</option>
              ))}

            </select>
            <div className='edit-buttons'>

            </div>
            <button onClick={async () => {
              const catalogId = selectedCatalog[item.id];
              if(!catalogId) return alert('Seleciona un catalogo primero');
              await addArticleToCatalog(Number(catalogId), item.id);
              alert('Articulo añadido al catalogo');
            }}>
              Añadir a Catalogo
            </button>

          <button onClick={() => navigate(`/editar/${item.id}`)}>Editar</button>

          <button onClick={() => handleDelete(item)}>Eliminar</button>
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
