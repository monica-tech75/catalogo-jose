import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addArticleToCatalog, getAllArticles, getAllTags } from '../services/dbService';
import { deleteArticleById } from '../services/dbService';
import { Link } from 'react-router-dom'
import '../styles/catalog.css'
import { getAllCatalogs } from '../services/dbService';

const Catalogs = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [catalogs, setCatalogs] = useState([]);
    const [selectedCatalog, setSelectedCatalog] = useState({});
    const [availableTags, setAvailableTags] = useState([])


    useEffect(() => {
      const fetchArticles = async () => {
        const items = await getAllArticles();
        setArticles(items);
      };

      const fetchCatalogs = async () => {
        const cats = await getAllCatalogs();
        setCatalogs(cats)
      };
      const fetchTags = async () => {
        const allTags = await getAllTags();
        setAvailableTags(['Todos', ...allTags.map(tag => tag.name)])
      };
      fetchArticles();
      fetchCatalogs();
      fetchTags()
    }, []);

    const filteredArticles = selectedCategory === 'Todos'
    ? articles
    : articles.filter(item => Array.isArray(item.tags) && item.tags.includes(selectedCategory));


    const handleDelete = async (item) => {
      const result = await deleteArticleById(item.id);
      alert(result.message);

      if (result.success) {
        setArticles(prev => prev.filter(article => article.id !== item.id));
      }
    };
    // Checkbox de seleccion multiple

    const handleCheckboxChange = (articleId, checked) => {
      setSelectedArticles(prev =>
        checked ? [...prev, articleId] : prev.filter(id => id !== articleId)
      );
    };
    // Selecion de catalogo por articulo

    const handleCatalogSelect = (articleId, catalogId) => {
      setSelectedCatalog(prev => ({ ...prev, [articleId]: catalogId }));
    };

    // Verificar si el articulo ya esta en el catalogo

    const isArticleInCatalog = (catalogId, articleId) => {
      if (!catalogs.length) return false;
      const catalog = catalogs.find(cat => cat.id === Number(catalogId));
      return catalog?.articleIds?.includes(articleId)
    };

    // Añadir articulo individualmente

    const handleAddToCatalog = async (articleId) => {
      const catalogId = selectedCatalog[articleId];
      if (!catalogId) return alert('Selecciona un catalogo primero');

      if (isArticleInCatalog(catalogId, articleId)) {
        return alert('Este articulo ya esta en el catalogo')
      }

      await addArticleToCatalog(Number(catalogId), articleId);
      alert('Articulo añadido correctamente');
    };
    // Añadir articulos seleccionados en lote

    const handleBulkAddToCatalog = async () => {
      const catalogId = selectedCatalog.bulk;
      if (!catalogId) return alert('Seleciona un catalogo primero');
      if (selectedArticles.length === 0) return alert('No hay articulos seleccionados');

      const catalog = catalogs.find(cat => cat.id === Number(catalogId));
      const alreadyInCatalog = catalog?.articleIds || [];

      const articlesToAdd = selectedArticles.filter(id => !alreadyInCatalog.includes(id));

      if (articlesToAdd.length === 0) {
        return alert('Todos los articulos ya estan en el catalogo');
      };
      for (const articleId of articlesToAdd) {
        await addArticleToCatalog(Number(catalogId), articleId);
      };

      alert(`${articlesToAdd.length} articulo(s) añadidos al catalogo`);
      setSelectedArticles([])
    }

    // Limpiar seleccion

    const clearSeleccion = () => {
      setSelectedArticles([]);
    };



  return (
    <>
    <div className='catalogs-container'>
      <section className='nav-crear'>
      <h3><Link to="/">Inicio</Link></h3>
      </section>

        {/* Dropdown de categorias */}
        <div className="dropdown-container">
          <label htmlFor="category-select">Filtrar por categoria</label>
          <select
          name="category-select"
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          >
          {availableTags.map((tag) => (
            <option key={tag} value={tag} >{tag}</option>

          ))}
          </select>

          <select
          value={selectedCatalog.bulk || ''}
          onChange={(e) => setSelectedCatalog(prev => ({ ...prev, bulk: e.target.value}))}
          >
             <option value="">-- Selecciona catálogo --</option>
            {catalogs.map(cat => (
              <option
              key={cat.id}
              value={cat.id}
              >{cat.name}</option>
            ))}

          </select>
          <button onClick={handleBulkAddToCatalog}>Añadir a catalogo</button>
          <button onClick={clearSeleccion}>Limpiar Seleccion</button>

        </div>
        <div className="gallery">
  {filteredArticles.map((item) => {
    if (item.imageBlob) {
      try {
        const imageUrl = URL.createObjectURL(item.imageBlob);
        return (
          <div key={item.id} className="card">
            <input
            type='checkbox'
            checked={selectedArticles.includes(item.id)}
            onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
             />
            <img
              src={imageUrl}
              alt="Artículo"
              style={{ width: '150px' }}
            />
            <p>{item.description}</p>
            <select
            value={selectedCatalog[item.id] || ''}
            onChange={(e) => handleCatalogSelect(item.id, e.target.value)}
            >
              <option value=''>Selecciona catalogo</option>
              {catalogs.map(cat => (
                <option value={cat.id} key={cat.id}>{cat.name}</option>
              ))}

            </select>
            <div className='edit-buttons'>
            <button onClick={() => handleAddToCatalog(item.id)}>
              Añadir a Catalogo
            </button>

          <button onClick={() => navigate(`/editar/${item.id}`)}>Editar</button>

          <button onClick={() => handleDelete(item)}>Eliminar</button>

            </div>

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
   {/*  {isEditing && editingArticle && (
      <EditArticle
      article={editingArticle}
      onSave={handleSave}
      />
    )} */}
    </>

  )
}

export default Catalogs
