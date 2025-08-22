import { useState, useEffect } from "react"
import { createCatalog, getAllCatalogs, getArticlesByCatalog, removeArticleFromCatalog } from "../services/dbService";
import { Link, useNavigate } from "react-router-dom";
import '../styles/catalog.css'

const CreateCatalog = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [catalogs, setCatalogs] = useState([]);
    const [selectedCatalog, setSelectedCatalog] = useState(null);
    const navigate = useNavigate();

    const handleCreate = async () => {
        if(!name.trim()) return setMessage('⚠️ El nombre no puede estar vacio');
        try {
            // Crear el nuevo catalago
            const id = await createCatalog(name.trim());

            // Añadir el nuevo catalogo
            const newCatalog = {id, name: name.trim(), articleIds: [] }
            setCatalogs(prev => [...prev, newCatalog])
            setName('');
            setMessage(`✅ Catálogo "${name.trim()}" creado con éxito`);
        } catch (error) {
            console.error(error);
            setMessage('❌ Error al crear el catalogo')
        }
    }

    const handleSelectedCatalog = async (catalog) => {
        const articles = await getArticlesByCatalog(catalog.id);
        setSelectedCatalog({...catalog, articles})
    }

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const allCatalogs = await getAllCatalogs();
                setCatalogs(allCatalogs)
            } catch (error) {
                console.error(error);
                setMessage('❌ Error al cargar los catálogos')
            }
        };
        fetchCatalogs();
    });

    const navigateToCatalog = (catalog) => {
        navigate('/exportar', { state: { catalog }})
    }

  return (
    <>
    <Link to="/"><button>🏠 Volver a Inicio</button></Link>
      <div>
        <h2>Crear nuevo catalogo</h2>
        <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del catalogo"
        />
        <button onClick={handleCreate}>Crear</button>
        {message && <div className="success-message">{message}</div>}
    </div>

    <div className="catalogs-wrapper">
        <h2>Catalogos Disponibles</h2>
        <ul className="catalogos-lista">
            {
                catalogs.map(cat => (
                    <li key={cat.id} onClick={() => handleSelectedCatalog(cat)}><strong>{cat.name} (ID: {cat.id})</strong></li>

                ))
            }
        </ul>
    </div>

        {selectedCatalog && (
            <div className="catalog-preview">
                <h3>Articulos en "{selectedCatalog.name}"</h3>
                <ul>
                    {selectedCatalog.articles.map(article => (
                        <li key={article.id}>{article.id} {article.description}</li>
                    ))}
                </ul>



            </div>
        )}
        <button onClick={() => navigateToCatalog(selectedCatalog)}>
            📤 Ir a exportar catálogo
        </button>


    </>

  )
}

export default CreateCatalog
