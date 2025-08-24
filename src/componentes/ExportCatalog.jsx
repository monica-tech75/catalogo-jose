import { exportCatalog } from "../services/dbService";
import { useLocation } from 'react-router-dom';
import '../styles/exportar.css'

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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 50px;
}



  .item {
    background-color: var(--color-dorado-suave);
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
    .item textarea {
     width: 100%;
    resize: none;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0.5rem;
    font-size: 0.9rem;
    background-color: #fff;
    box-sizing: border-box;
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
.modal textarea {
width: 40vw;
border-radius: 6px;
border: 1px solid #ccc;
font-size: 0.9rem;
}

.modal:target {
  display: flex;
  flex-direction: column;
}
  .modal:target img {
  opacity: 1;
  transform: scale(1);
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .item {
    padding: 0.75rem;
    gap: 16px;
  }

  .item textarea {
    font-size: 0.85rem;
  }

  .modal img {
    max-width: 90vw;
    max-height: 60vh;
  }

  .modal textarea {
    width: 80vw;
    font-size: 0.85rem;
  }
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
                    <p><strong>Artículo ${article.id}</strong></p>
                    <a href="#img${article.id}">
                    <img src="${base64Image}" alt="Imagen del artículo ${article.id}" />
                </a>
                <textarea>${article.description}</textarea>
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
                    <textarea>${article.description}</textarea>
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
     <h2>Catalogo * {catalog.name.toUpperCase()} *</h2>
        <div className="export-catalog" id="catalog-to-export">

        {catalog.articles.map(article => (
            <div
            key={article.id}
            className="export-card-preview"
            >
                <p><span>Articulo {article.id } - </span></p>
                <img
                src={URL.createObjectURL(article.imageBlob)}
                alt="Imagen de articulos"
                />
                <textarea>{article.description}</textarea>
            </div>
        ))}
        </div>
        <div className="btn-wrapper-descarga">
    <button onClick={handleExport}>📤 Exportar Catalogo</button>
    <button onClick={() => window.print()}>🖨️ Imprimir catálogo</button>
    <button onClick={handleExportHTML}>📄 Descargar como HTML</button>
    </div>

    </div>

    </>

  )
}

export default ExportCatalog
