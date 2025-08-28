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

        .item {
          background-color: #fff8e1;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .item textarea {
          width: 100%;
          resize: none;
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 0.5rem;
          font-size: 1.2rem;
          background-color: #fff;
        }
        .carrusel {
          position: relative;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }

       .carrusel-imagenes {
    display: flex;
    transition: transform 0.5s ease-in-out;
    touch-action: pan-x;
    scroll-snap-type: x mandatory;
    overflow-x: auto;
    scroll-behavior: smooth;
}
        .carrusel-imagenes img {
          width: 100%;
          flex: 0 0 100%;
          border-radius: 6px;
          scroll-snap-align: start;
        }
        .carrusel-botones {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          transform: translateY(-50%);
          padding: 0 10px;
        }
        .carrusel-botones button {
          background-color: rgba(0,0,0,0.5);
          color: white;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 4px;
        }
        @media (max-width: 600px) {
          .grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .item textarea {
            font-size: 0.85rem;
          }
          .item {
            width: 100%;
          }

          .carrusel {
            width: 100%;
            max-width: 100%;
          }

        }


      </style>
    </head>
    <body>
      <h1>Catálogo para ${catalog.name}</h1>
      <div class="grid">
  `;

  for (const article of catalog.articles) {
    const blobs = Array.isArray(article.imageBlobs)
      ? article.imageBlobs
      : article.imageBlob instanceof Blob
        ? [article.imageBlob]
        : [];

    const base64Images = await Promise.all(blobs.map(blob => blobToBase64(blob)));

    html += `
    <div class="item">
      <p><strong>Artículo ${article.id}</strong></p>

      <div class="carrusel" id="carrusel-${article.id}">
        <div class="carrusel-imagenes">
          ${base64Images.map((img, i) => `<img src="${img}" alt="Imagen ${i + 1}" />`).join('')}
        </div>
        <div class="carrusel-botones">
          <button onclick="moverCarrusel(${article.id}, -1)">⬅️</button>
          <button onclick="moverCarrusel(${article.id}, 1)">➡️</button>
        </div>
      </div>
      <textarea readonly>${article.description}</textarea>
      <a href="https://wa.me/?text=Artículo%20${article.id}%0A${article.description}" target="_blank" rel="noopener noreferrer">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Compartir por WhatsApp" style="width: 24px; height: 24px;" />
      </a>
    </div>
  `;
}

  html += `
      </div>
      <script>
        const carruselIndices = {};
        function moverCarrusel(id, direccion) {
          const carrusel = document.querySelector('#carrusel-' + id + ' .carrusel-imagenes');
          if (!carrusel || !carrusel.children || carrusel.children.length === 0) {
            console.warn('⚠️ Carrusel no encontrado o vacío para artículo ' + id);
            return;
          }
          const total = carrusel.children.length;
          carruselIndices[id] = (carruselIndices[id] || 0) + direccion;
          if (carruselIndices[id] < 0) carruselIndices[id] = total - 1;
          if (carruselIndices[id] >= total) carruselIndices[id] = 0;
          carrusel.style.transform = 'translateX(-' + (carruselIndices[id] * 100) + '%)';
        }
      </script>
    </body>
    </html>
  `;

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
    const carruselIndices = {};

    const moverCarrusel = (id, direccion) => {
      const carrusel = document.querySelector(`#carrusel-${id} .carrusel-imagenes`);
      if (!carrusel) return;

      const total = carrusel.children.length;
      carruselIndices[id] = (carruselIndices[id] || 0) + direccion;

      if (carruselIndices[id] < 0) carruselIndices[id] = total - 1;
      if (carruselIndices[id] >= total) carruselIndices[id] = 0;

      carrusel.style.transform = `translateX(-${carruselIndices[id] * 100}%)`;
    };


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
                <div className="carrusel-preview" id={`carrusel-${article.id}`}>
  <div className="carrusel-imagenes">
    {(article.imageBlobs || [article.imageBlob]).map((blob, index) => (
      <img key={index} src={URL.createObjectURL(blob)} alt={`Imagen ${index + 1}`} />
    ))}
  </div>
  {(article.imageBlobs?.length || 0) > 1 && (
    <div className="carrusel-botones">
      <button onClick={() => moverCarrusel(article.id, -1)}>⬅️</button>
      <button onClick={() => moverCarrusel(article.id, 1)}>➡️</button>
    </div>
  )}
</div>
                <textarea defaultValue={article.description} readOnly />

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
