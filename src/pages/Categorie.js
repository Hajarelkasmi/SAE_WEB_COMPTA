import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/Categorie.css';
import {Button} from "react-bootstrap";
import {checkAdmin} from "./CheckAdmin";

const Categorie = () => {
    const { id_categorie } = useParams();
    const [categorie, setCategorie] = useState(null);
    const [pages, setPages] = useState([]);
    const [sousCategories, setSousCategories] = useState([]);
    const [isAdmin, setisAdmin] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchAdminStatus = async () => {
            const adminStatus = await checkAdmin();
            setisAdmin(adminStatus);
        }
        fetchAdminStatus();

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/categories/${id_categorie}`,
                    {headers: {'Authorization': localStorage.getItem('token')}});
                if (!response.ok) {
                    setError('Erreur lors de la récupération de la catégorie : ' + response.statusText);
                    throw new Error('Erreur lors de la récupération de la catégorie');
                }
                const data = await response.json();
                setCategorie(data);

                const responsePages = await fetch(`http://localhost:5000/api/pages?categorie_id=${id_categorie}`,
                    {headers: {'Authorization': localStorage.getItem('token')}});
                if (!responsePages.ok) {
                    throw new Error('Erreur lors de la récupération des pages');
                }
                const dataPages = await responsePages.json();
                setPages(dataPages);

                const reponseSousCategories = await fetch(`http://localhost:5000/api/sous_categories/${id_categorie}`, 
                    {headers: {'Authorization': localStorage.getItem('token')}});
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

    if (error) {
        return <div style={{color: 'red'}}>{error}</div>;
    }

    return (
        <div className="categorie">
            {isAdmin && <Button className={"cat_button"} href="/categories/create">Créer une nouvelle catégorie</Button>}
            {isAdmin && <Button className={"cat_button"} href={`/categories/${id_categorie}/edit`}>Modifier</Button>}
            <h1>{categorie?.nom}</h1>
            <p>{categorie?.description}</p>
            <h2>Sous-catégories :</h2>
            {sousCategories.length === 0 && <p>Aucune sous-catégorie trouvée</p>}
            <ul>
                {sousCategories.map(sc => (
                    <li key={sc.id}>
                        <Link className={"cat_link"} to={`/categories/${sc.id}`}>{sc.nom}</Link>
                    </li>
                ))}
            </ul>
            {isAdmin && <a className={"cat_link"} href={`/categories/${id_categorie}/create`}>Créer une nouvelle sous-catégorie</a>}
            <h2>Pages :</h2>
            {pages.length === 0 && <p>Aucune page trouvée</p>}
            <ul>
                {pages.map(page => (
                    <li key={page.id}>
                        <Link className={"cat_link"} to={`/page/${page.id}`}>{page.nom}</Link>
                    </li>
                ))}
            </ul>
            {isAdmin && <a className={"cat_link"} href={`/categories/${id_categorie}/pages/`}>Créer une nouvelle page</a>}
        </div>
    );
}

export default Categorie;