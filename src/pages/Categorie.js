import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/Categorie.css';
import {Button} from "react-bootstrap";

const Categorie = () => {
    const { id_categorie } = useParams();
    const [categorie, setCategorie] = useState(null);
    const [pages, setPages] = useState([]);
    const [sousCategories, setSousCategories] = useState([]);

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

                const reponseSousCategories = await fetch(`http://localhost:5000/api/sous_categories/${id_categorie}`);
                if (!reponseSousCategories.ok) {
                    throw new Error('Erreur lors de la récupération des sous-catégories');
                }
                const dataSousCategories = await reponseSousCategories.json();
                setSousCategories(dataSousCategories);


                console.log('Catégorie:', data);
                console.log('Pages:', dataPages);
                console.log('Sous-catégories:', dataSousCategories);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };
        fetchData();
    }
    , [id_categorie]);

    return (
        <div className="categorie">
            <Button href={`/categories/${id_categorie}/edit`}>Modifier</Button>
            <h1>{categorie?.nom}</h1>
            <p>{categorie?.description}</p>
            <h2>Sous-catégories :</h2>
            {sousCategories.length === 0 && <p>Aucune sous-catégorie trouvée</p>}
            <ul>
                {sousCategories.map(sc => (
                    <li key={sc.id}>
                        <Link to={`/categories/${sc.id}`}>{sc.nom}</Link>
                    </li>
                ))}
            </ul>
            <a href={`/categories/${id_categorie}/create`}>Créer une nouvelle sous-catégorie</a>
            <h2>Pages :</h2>
            {pages.length === 0 && <p>Aucune page trouvée</p>}
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