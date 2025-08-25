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
    <>
    <Link to="/"><button>🏠 Inicio</button></Link>

    <div className="catalogs-wrapper">
        <h2>Catalogos Disponibles</h2>
        <ul className="catalogos-lista">
            {
                catalogs.map((cat) => (
                    <li
                    key={cat.id}
                    onClick={() => handleSelectedCatalog(cat)}
                    ><strong>{cat.name} (ID: {cat.id})</strong></li>

                ))
            }
        </ul>
    </div>

        {selectedCatalog && (
            <div className="container-preview">
                <h3 className="preview-title">Articulos en "{selectedCatalog.name}"</h3>
                <div className="preview-grid">
                {selectedCatalog.articles.map(article => (
                    <div
                    key={article.id}
                    className="card-preview">
                        <h3>{article.id}</h3>
                        <img src={URL.createObjectURL(article.imageBlob)} alt={article.description}/>
                        <textarea>{article.description}</textarea>
                    </div>
                ))}
                </div>
            </div>
        )}


        <button onClick={() => navigateToCatalog(selectedCatalog)}>
            📤 Ir a exportar catálogo
        </button>


    </>

  )
}

export default CreateCatalog
