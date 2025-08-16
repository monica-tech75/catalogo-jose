import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById } from '../services/dbService';
import EditArticle from '../componentes/EditArticle';

const EditArticlePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            const data = await getArticleById(Number(id));
            setArticle(data);
        }
        fetchArticle();

    }, [id]);

    const handleSave = () => {
        navigate('/catalogs')
    }
    return (
        <>
        <button onClick={handleSave}> Ir a Catalogo</button>
        {
             article ? (
                <EditArticle article={article} onSave={handleSave}/>

            ) : (
                <p>Cargando articulo...</p>
            )

        }

        </>


    )
}

export default EditArticlePage
