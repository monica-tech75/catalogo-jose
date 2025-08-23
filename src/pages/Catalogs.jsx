import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addArticleToCatalog, createCatalog, getAllArticles, getAllTags, removeArticleFromCatalog } from '../services/dbService';
import { Link } from 'react-router-dom'
import '../styles/catalog.css'
import { getAllCatalogs } from '../services/dbService';
import { FaAngleDoubleLeft } from "react-icons/fa";

const Catalogs = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [catalogs, setCatalogs] = useState([]);
    const [selectedCatalog, setSelectedCatalog] = useState({});
    const [availableTags, setAvailableTags] = useState([]);
    const [newCatalogName, setNewCatalogName] = useState('');
    const [catalogMessage, setCatalogMessage] = useState('');


    useEffect(() => {
      const fetchData = async () => {
        try {
          const [items, cats, allTags] = await Promise.all([
            getAllArticles(),
            getAllCatalogs(),
            getAllTags()
          ]);

          setArticles(items);
          setCatalogs(cats);
          setAvailableTags(['Todos', ...allTags.map(tag => tag.name)]);
        } catch (error) {
          console.error('Error al cargar datos:', error);
          // Aquí puedes mostrar un mensaje al usuario si quieres
        }
      };

      fetchData();
    }, []);


    const filteredArticles = selectedCategory === 'Todos'
    ? articles
    : articles.filter(item => Array.isArray(item.tags) && item.tags.includes(selectedCategory));



    // Checkbox de seleccion multiple

    const handleCheckboxChange = (articleId, checked) => {
      setSelectedArticles(prev =>
        checked ? [...prev, articleId] : prev.filter(id => id !== articleId)
      );
    };

    // Verificar si el articulo ya esta en el catalogo

    const isArticleInCatalog = (catalogId, articleId) => {
      if (!catalogs.length) return false;
      const catalog = catalogs.find(cat => cat.id === Number(catalogId));
      return catalog?.articleIds?.includes(articleId)
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
      setSelectedArticles([]);

      const updatedCatalogs = await getAllCatalogs();
      setCatalogs(updatedCatalogs)
    }

    // Limpiar seleccion

    const clearSeleccion = () => {
      setSelectedArticles([]);
    };

    const handleCreateCatalog = async () => {
      if(!newCatalogName.trim()) return setCatalogMessage('⚠️ El nombre no puede estar vacio');
      try {
        // crear nuevo catalogo
        const id = await createCatalog(newCatalogName.trim());

        // Añadir el nuevo catalogo
        const newCatalog = {id, name: newCatalogName.trim(), articleIds: [] };
        setCatalogs(prev => [...prev, newCatalog]);
        setNewCatalogName('');
        setCatalogMessage(`✅ Catalogo "${newCatalogName.trim()}" creado con exito`)
      } catch (error) {
        console.error(error);
        setCatalogMessage('❌ Error al crear el catalogo')
      }
    };

    // Eliminar articulo del catalogo
    const handleRemoveFromCatalog = async (articleId) => {
      const catalogId = selectedCatalog.bulk;
      if (!catalogId) return alert('Selecciona un catálogo primero');

      try {
        await removeArticleFromCatalog(Number(catalogId), articleId);
        const updatedCatalogs = await getAllCatalogs();
        setCatalogs(updatedCatalogs);
        alert(`🗑 Artículo ${articleId} eliminado del catálogo`);
      } catch (error) {
        console.error(error);
        alert('❌ Error al eliminar el artículo del catálogo');
      }
    };


  return (
    <>
    <div className='catalogs-container'>
      <section className='nav-crear'>
    <FaAngleDoubleLeft />
      <h3><Link to="/">Inicio</Link></h3>
      <h3><Link to="/crearCatalogo">Crear</Link></h3>
      </section>

        {/* Dropdown de categorias */}
        <div className="dropdown-container">
          <label htmlFor="category-select"
          className='sr-only'
          >Filtrar</label>
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

          <div className='btn añadir-limpiar'>
          <button onClick={handleBulkAddToCatalog}>Añadir a catalogo</button>
          <button onClick={clearSeleccion}>Limpiar Seleccion</button>
          </div>

          <div className='crear-catalogo'>
            <input
            type='text'
            value={newCatalogName}
            placeholder='Nombre'
            onChange={(e) => setNewCatalogName(e.currentTarget.value)}
             />
          <button onClick={handleCreateCatalog}>Nuevo Catalogo</button>
          {catalogMessage && <p className='mensaje-catalogo'>{catalogMessage}</p>}
          </div>

        </div>
        <div className="gallery">
  {filteredArticles.map((item) => {
    if (item.imageBlob) {
      try {
        const imageUrl = URL.createObjectURL(item.imageBlob);
        return (
          <div key={item.id} className={`card ${
            selectedCatalog.bulk && isArticleInCatalog(selectedCatalog.bulk, item.id)
              ? 'en-catalogo'
              : ''
         }`}>
            <input
            type='checkbox'
            disabled={selectedCatalog.bulk && isArticleInCatalog(selectedCatalog.bulk, item.id)}
            checked={selectedArticles.includes(item.id)}
            onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
            className='checkbox-añadir'

             />
            <img
              src={imageUrl}
              alt="Artículo"
              style={{ width: '150px' }}
            />
            <textarea value={item.description} readOnly />
            <textarea value={item.privateDescription} readOnly />
            <div className='edit-buttons'>
              <button
              onClick={() => navigate(`/editar/${item.id}`)}
              className='btn-editar'
              >Editar</button>
            {selectedCatalog.bulk && isArticleInCatalog(selectedCatalog.bulk, item.id) && (
              <button
                className="btn-quitar"
                onClick={() => handleRemoveFromCatalog(item.id)}
            >
              Eliminar
              </button>
            )}


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

    </>

  )
}

export default Catalogs
