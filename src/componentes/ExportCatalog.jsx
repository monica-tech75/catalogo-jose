import { useEffect } from "react";
import { exportCatalog, getArticlesByCatalog } from "../services/dbService";
import { useLocation } from 'react-router-dom';




const ExportCatalog = () => {
    const location = useLocation();

    const catalog = location.state?.catalog;

    /* const [catalog, setCatalog] = useState(null); */

    const handleExport = async () => {
        try {
            const json = await exportCatalog(catalog.id);
            const blob = new Blob([json], { type: 'aplication/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${catalog.name.replace(/\s+/g, '_')}_export.json`;
            link.click();
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('❌ Error al exportar el catálogo:', error);
            alert('Hubo un problema al exportar el catálogo');
        }
    }
  /*   useEffect(() => {
        const fetchCatalog = async () => {
            const articles = await getArticlesByCatalog(Number(id));
            setCatalog({ id, name: `Catalogo ${id}`, articles })
        };
        fetchCatalog()
    }, [id]); */

    if (!catalog) return <p>Cargando catalogo</p>;


  return (
    <>
     <div className="export-catalog-wrapper" id="catalog-to-export-wrapper">
        <div className="export-catalog" id="catalog-to-export">
        <h2>Catalogo para {catalog.name}</h2>
        {catalog.articles.map(article => (
            <div key={article.id}>
                <p><span>Articulo {article.id } - </span> {article.description}</p>
                <img
                src={URL.createObjectURL(article.imageBlob)}
                alt="Imagen de articulos"
                style={{ width: '150px', marginTop: '10px' }}
                />
            </div>
        ))}
        </div>
        <div>
    <button onClick={handleExport}>📤 Exportar Catalogo</button>
    <button onClick={() => window.print()}>🖨️ Imprimir catálogo</button>


    </div>

    </div>

    </>

  )
}

export default ExportCatalog
