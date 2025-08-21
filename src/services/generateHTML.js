export const generarHTMLCatalogo = () => {
    let html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Catálogo - ${catalog.name}</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          .item { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
          img { max-width: 150px; display: block; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Catálogo para ${catalog.name}</h1>
    `;
    catalog.articles.forEach(article => {
        const imageUrl = URL.createObjectURL(article.imageBlob);
        html += `
          <div class="item">
            <p><strong>Artículo ${article.id}:</strong> ${article.description}</p>
            <img src="${imageUrl}" alt="Imagen del artículo ${article.id}" />
          </div>
        `;
    });

    html += `</body></html>`;
    return html;
};

export const handleExportHTML = () => {
    const htmlContent = generarHTMLCatalogo();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${catalog.name.replace(/\s+/g, '_')}_catalogo.html`;
    link.click();
    URL.revokeObjectURL(url)
}
