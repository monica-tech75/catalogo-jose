import { exportCatalog } from "../services/dbService";
import { useLocation } from 'react-router-dom';

const ExportCatalog = () => {
    const location = useLocation();
    const catalog = location.state?.catalog;

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

    if (!catalog) return <p>Cargando catalogo</p>;

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

    const generarHTMLCatalogo = async () => {
        let html = `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <title>Catálogo - ${catalog.name}</title>
          <style>
  body {
    font-family: sans-serif;
    padding: 20px;
    background: #f9f9f9;
  }

  h1 {
    text-align: center;
    margin-bottom: 40px;
  }

  .grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }

  .item {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    width: calc(33.333% - 40px); /* 3 por fila */
    box-sizing: border-box;
    transition: transform 0.2s;
  }

  .item:hover {
    transform: scale(1.02);
  }

  .item img {
    max-width: 100%;
    height: auto;
    cursor: pointer;
    border-radius: 4px;
  }

  /* Modal para agrandar imagen */
.modal {
  display: none;
  position: fixed;
  z-index: 999;
  left: 0; top: 0;
  width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.95);
  justify-content: center;
  align-items: center;
}

.modal-content {
  position: relative;
}

.modal img {
  max-width: 70vw;
  max-height: 70vh;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(255,255,255,0.2);
   opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal:target {
  display: flex;
}
  .modal:target img {
  opacity: 1;
  transform: scale(1);
}
</style>
          </head>
          <body>
            <h1>Catálogo para ${catalog.name}</h1>
            <div class="grid">
        `;
        for (const article of catalog.articles) {
            const base64Image = await blobToBase64(article.imageBlob);
            html += `
                <div class="item">
                    <p><strong>Artículo ${article.id}:</strong> ${article.description}</p>
                    <a href="#img${article.id}">
                    <img src="${base64Image}" alt="Imagen del artículo ${article.id}" />
                </a>
            </div>
            `;
          }

          html += `</div>`
          // Generar los modales dinámicos
        for (const article of catalog.articles) {
            const base64Image = await blobToBase64(article.imageBlob);
            html += `
                <div id="img${article.id}" class="modal">
                    <a href="#"><img src="${base64Image}" alt="Imagen ampliada del artículo ${article.id}" /></a>
        </div>
    `;
  }

        html += `
        <script>
         // Cierra el modal al hacer clic fuera de la imagen
  function closeModal(event) {
    const modalContent = event.target.closest('.modal-content');
    if (!modalContent || !modalContent.contains(event.target)) {
      window.location.hash = '';
    }
  }

  // Cierra el modal al pulsar la tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.location.hash = '';
    }
  });
</script>

          </body>
          </html>`;
          return html;
        };

     const handleExportHTML = async () => {
        const htmlContent = await generarHTMLCatalogo();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${catalog.name.replace(/\s+/g, '_')}_catalogo.html`;
        link.click();
        URL.revokeObjectURL(url)
    }


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
    <button onClick={handleExportHTML}>📄 Descargar como HTML</button>



    </div>

    </div>

    </>

  )
}

export default ExportCatalog
