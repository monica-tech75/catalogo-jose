import { useEffect, useState } from 'react';
import { getAllArticles } from '../services/dbService';
import { Link } from 'react-router-dom'

const Catalogs = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
      const fetchArticles = async () => {
        const items = await getAllArticles();
        setArticles(items);
      };
      fetchArticles();
    }, []);

  return (
    <div>
        <h3><Link to="/">Back Home</Link></h3>
        <h2>Catalogs</h2>
        <div className="gallery">
      {articles.map((item) => (
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
