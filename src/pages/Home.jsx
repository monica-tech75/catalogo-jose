import '../styles/home.css'

const Home = () => {
  return (
   <main className='home-preview'>
    <section className='intro-message'>
    <h1>📦 Crea tu catálogo personalizado</h1>
    <p>Organiza tus articulos y exporta tu catalogo en PDF, HTML, o formato JSON</p>
    </section>
    <section className='preview-grid'>
      {[1, 2, 3].map((_, index) => (
        <div key={index} className='card-preview empty'>
          <div className="image-placeholder">Sin Imagen</div>
          <h3 className="titulo-articulo">Titulo del articulo</h3>
          <textarea name="descripcion" id="descripcion" readOnly placeholder='Descripcion del articulo...' />
          <div className="tag-placeholder">
            <p>Tag1</p>
            <p>Tag2</p>
            <p>Tag3</p>
          </div>
        </div>
      ))}
    </section>
   </main>
  )
}

export default Home
