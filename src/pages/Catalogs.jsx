import { useEffect, useState } from 'react';
import { getAllArticles } from '../services/dbService';
import { Link } from 'react-router-dom'
import '../styles/catalog.css'

const Catalogs = () => {
    const [articles, setArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const categories = [ 'Todos', 'Fiestas', 'Deporte', 'Nombres', 'Puzzles', 'Figuras'];

    useEffect(() => {
      const fetchArticles = async () => {
        const items = await getAllArticles();
        setArticles(items);
      };
      fetchArticles();
    }, []);

    const filteredArticles = selectedCategory === 'Todos'
    ? articles
    : articles.filter(item => Array.isArray(item.tags) && item.tags.includes(selectedCategory));

    console.log(articles);

  return (
    <div className='catalogs-container'>
        <h3><Link to="/">Back Home</Link></h3>
        <h2>Catalogs</h2>
        {/* Dropdown de categorias */}
        <div className="dropdown-container">
          <label htmlFor="category-select">Filtrar por categoria</label>
          <select
          name="category-select"
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          >
          {categories.map((cat) => (
            <option key={cat} value={cat} >{cat}</option>

          ))}
          </select>
        </div>
        <div className="gallery">
      {filteredArticles.map((item) => (
        <div key={item.id} className="card">
          <img src={item.image} alt="Artículo" style={{ width: '150px' }} />
          <p>{item.description}</p>
          <h3>{item.price} €</h3>
        </div>
      ))}
    </div>
    </div>
  )
}

export default Catalogs
