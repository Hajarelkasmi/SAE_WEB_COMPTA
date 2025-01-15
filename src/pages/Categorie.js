import React, {useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import '../css/Categorie.css';
import { Button } from "react-bootstrap";
import {InfosContext} from "../InfosContext";
import Main_Page_Preview from "./Main_Page_Preview";

const Categorie = () => {
    const { id_categorie } = useParams();
    const [categorie, setCategorie] = useState(null);
    const [pages, setPages] = useState([]);
    const [sousCategories, setSousCategories] = useState([]);
    const {isAdmin} = useContext(InfosContext);
    const [error, setError] = useState(null);

    useEffect(() => {


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
            } catch (error) {
                console.error('Erreur:', error);
            }
        };
        fetchData();
    }
        , [id_categorie]);

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (sousCategories.length === 0 && pages.length === 1) {
        return (
            <div className="categorie">
                {isAdmin && <Button className={"cat_button"} href="/categories/create">Créer une nouvelle catégorie</Button>}
                {isAdmin && <Button className={"cat_button"} href={`/categories/${id_categorie}/edit`}>Modifier la catégorie</Button>}
                <div class="general-div-cat">
                    <div class="main-div-cat">
                        <h1 class="title-cat">{categorie?.nom}</h1>
                        <p>{categorie?.description}</p>
                    </div>
                </div>
                <Main_Page_Preview id_page={pages[0].id} />
            </div>);
    }

    return (
        <div className="categorie">
                    {isAdmin && <Button className={"cat_button"} href={`/categories/${id_categorie}/create`}>Créer une nouvelle sous-catégorie</Button>}
                    {isAdmin && <Button className={"cat_button"} href={`/categories/${id_categorie}/pages/`}>Créer une nouvelle page</Button>}
            {isAdmin && <Button className={"cat_button"} href={`/categories/${id_categorie}/edit`}>Modifier la catégorie</Button>}
            <div class="general-div-cat">
                <div class="main-div-cat">
                    <h1 class="title-cat">{categorie?.nom}</h1>
                    <p>{categorie?.description}</p>
                </div>
            </div>
            <div className='cat-info-sous-categories'>
                {sousCategories.map(sousCategorie => (
                    <div key={sousCategorie.id}>
                        <a href={`/sous_categories/${sousCategorie.id}`}>{sousCategorie.nom}</a>
                    </div>
                ))}
            </div>
            <div className='cat-info-pages'>
                {pages.map(page => (
                    <div key={page.id}>
                    <a href={`/page/${page.id}`}>
                        <img src={`/static/image/${page.image}`} alt={page.nom} />
                        <p>{page.nom.replace(/<[^>]*>/g, '')}</p>
                    </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Categorie;