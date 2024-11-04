import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/Categorie.css';

const Categorie = () => {
    const { id_categorie } = useParams();
    const [categorie, setCategorie] = useState(null);
    const [pages, setPages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/categories/${id_categorie}`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération de la catégorie');
                }
                const data = await response.json();
                setCategorie(data);

                const responsePages = await fetch(`http://localhost:5000/api/pages?categorie_id=${id_categorie}`);
                if (!responsePages.ok) {
                    throw new Error('Erreur lors de la récupération des pages');
                }
                const dataPages = await responsePages.json();
                setPages(dataPages);

                console.log('Catégorie:', data);
                console.log('Pages:', dataPages);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };
        fetchData();
    }
    , [id_categorie]);

    return (
        <div class="categorie">
            <h1>{categorie?.nom}</h1>
            <p>{categorie?.description}</p>
            <h2>Pages :</h2>
            <ul>
                {pages.map(page => (
                    <li key={page.id}>
                        <Link to={`/page/${page.id}`}>{page.nom}</Link>
                    </li>
                ))}
            </ul>
            <a href={`/categories/${id_categorie}/pages/`}>Créer une nouvelle page</a>
        </div>
    );
}

export default Categorie;