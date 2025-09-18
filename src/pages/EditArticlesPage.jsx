import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById } from '../services/dbService';
import EditArticle from '../componentes/EditArticle';
import '../styles/editArticle.css'

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
        navigate('/modificar')
    }
    return (
        <>
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
