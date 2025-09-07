import { useState, useEffect } from "react"
import { getAllCatalogs, getArticlesByCatalog } from "../services/dbService";
import { useNavigate } from "react-router-dom";
import '../styles/createCatalog.css';

const CreateCatalog = () => {
    const [message, setMessage] = useState('');
    const [catalogs, setCatalogs] = useState([]);
    const [selectedCatalog, setSelectedCatalog] = useState(null);
    const [animateOut, setAnimateOut] = useState(false);


    const navigate = useNavigate();



    const handleSelectedCatalog = async (catalog) => {
        setAnimateOut(true); // activa salida

        setTimeout(async () => {
          const articles = await getArticlesByCatalog(catalog.id);
          setSelectedCatalog({ ...catalog, articles });
          setAnimateOut(false); // activa entrada
        }, 400); // duración de la animación de salida
      };

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
        <nav className="btn-export">
        <h1>Catalogos Disponibles</h1>
    <button onClick={() => navigateToCatalog(selectedCatalog)}>
            📤 Ir a exportar catálogo
        </button>
        </nav>
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
            <div className={`container-preview ${animateOut ? 'slide-out' : 'slide-in'}`}>
                <h2 className="preview-title">{selectedCatalog.name.toUpperCase()}</h2>
                <div className="preview-grid">
                {selectedCatalog.articles.map((article, index) => (
                    <div
                    key={article.id}
                    className="card-preview"
                    style={{ animationDelay: `${index * 0.2}s` }}
                    >
                        <h3><span>Nº {article.id}</span>{article.title}</h3>

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
