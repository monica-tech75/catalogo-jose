import { useState, useEffect } from "react"
import { getAllCatalogs, getArticlesByCatalog } from "../services/dbService";
import { Link, useNavigate } from "react-router-dom";
import '../styles/createCatalog.css';

const CreateCatalog = () => {
    const [message, setMessage] = useState('');
    const [catalogs, setCatalogs] = useState([]);
    const [selectedCatalog, setSelectedCatalog] = useState(null);
    const navigate = useNavigate();



    const handleSelectedCatalog = async (catalog) => {
        const articles = await getArticlesByCatalog(catalog.id);
        setSelectedCatalog({...catalog, articles})
    }

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const allCatalogs = await getAllCatalogs();
                setCatalogs(allCatalogs);
            } catch (error) {
                console.error(error);
                setMessage('❌ Error al cargar los catálogos')
            }
        };
        fetchCatalogs();
    }, []);

    const navigateToCatalog = (catalog) => {
        navigate('/exportar', { state: { catalog }})
    }

  return (

    <div className="catalogs-wrapper">
        <nav className="navbar catalogo-disponible">
        <Link to="/"><button>🏠 Inicio</button></Link>
    <button onClick={() => navigateToCatalog(selectedCatalog)}>
            📤 Ir a exportar catálogo
        </button>
        </nav>

        <h2>Catalogos Disponibles</h2>
        <ul className="catalogos-lista">
            {
                catalogs.map((cat) => (
                    <li
                    key={cat.id}
                    onClick={() => handleSelectedCatalog(cat)}
                    >{cat.name} (ID: {cat.id})</li>

                ))
            }
        </ul>


        {selectedCatalog && (
            <div className="container-preview">
                <h3 className="preview-title">Articulos en "{selectedCatalog.name}"</h3>
                <div className="preview-grid">
                {selectedCatalog.articles.map(article => (
                    <div
                    key={article.id}
                    className="card-preview">
                        <h3>{article.id}</h3>
                        {(article.imageBlobs || [article.imageBlob]).map((blob, index) => (
  <img key={index} src={URL.createObjectURL(blob)} alt={`Imagen ${index + 1}`} />
))}

                        <textarea name="descripcion" value={article.description} readOnly/>
                        <textarea name="descripcion-privada" value={article.privateDescription} readOnly/>
                    </div>
                ))}
                </div>
            </div>
        )}

        </div>

  )
}

export default CreateCatalog
