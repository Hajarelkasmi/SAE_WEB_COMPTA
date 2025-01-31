import React, { useState, useEffect, useContext } from 'react';
import '../css/Main_Page.css';
import {refresh} from "./RefreshToken";
import Container_Lien from './Container_Lien';
import Container_Article from './Container_Article';
import Container_Video from './Container_Video';
import Container_Exercice from './Container_Exercice';
import {InfosContext} from "../InfosContext";

const Main_Page_Preview = ({id_page}) => {  
    const id =  id_page;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rubrique, setRubrique] = useState([]);
    const {IP_api} = useContext(InfosContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`IP_api + /api/pages/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    } 
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);

                const liens_response = await fetch(`IP_api + /api/liens?page_id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
                if (!liens_response.ok) {
                    throw new Error(`HTTP error! status: ${liens_response.status}`);
                }
                const liens_result = await liens_response.json();
                const nouveaux_liens = liens_result.map((lien) => ({
                    id: lien.id,
                    nom: lien.Rubrique.nom,
                    description: lien.Rubrique.description,
                    lien: lien.lien,
                    type: "lien",
                    rubrique_id: lien.rubrique_id,
                    page_id : lien.Rubrique.page_id,
                    position : lien.Rubrique.position,
                    est_public: lien.Rubrique.est_public
                }));

                const articles_response = await fetch(`IP_api + /api/articles?page_id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
                if (!articles_response.ok) {
                    throw new Error(`HTTP error! status: ${articles_response.status}`);
                }
                const articles_result = await articles_response.json();
                const nouveaux_articles = articles_result.map((article) => ({
                    id: article.id,
                    nom: article.Rubrique.nom,
                    description: article.Rubrique.description,
                    texte: article.texte,
                    image: article.image,
                    type: "article",
                    rubrique_id: article.rubrique_id,
                    page_id : article.Rubrique.page_id,
                    position : article.Rubrique.position,
                    est_public: article.Rubrique.est_public
                }));
                
                const videos_response = await fetch(`IP_api + /api/videos?page_id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
                if (!videos_response.ok) {
                    throw new Error(`HTTP error! status: ${videos_response.status}`);
                }
                const videos_result = await videos_response.json();
                const nouvelles_videos = videos_result.map((video) => ({
                    id: video.id,
                    nom: video.Rubrique.nom,
                    description: video.Rubrique.description,
                    lien: video.lien,
                    type: "video",
                    rubrique_id: video.rubrique_id,
                    page_id : video.Rubrique.page_id,
                    position : video.Rubrique.position,
                    est_public: video.Rubrique.est_public
                }));

                const exercices_response = await fetch(`IP_api + /api/exercices?page_id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
                if (!exercices_response.ok) {
                    throw new Error(`HTTP error! status: ${exercices_response.status}`);
                }
                const exercices_result = await exercices_response.json();
                const nouveaux_exercices = exercices_result.map((exercice) => ({
                    id: exercice.id,
                    nom: exercice.Rubrique.nom,
                    description: exercice.Rubrique.description,
                    texte: exercice.texte,
                    lien_fichier_exercice: exercice.lien_fichier_exercice,
                    lien_fichier_correction: exercice.lien_fichier_correction,
                    type: "exercice",
                    rubrique_id: exercice.rubrique_id,
                    page_id : exercice.Rubrique.page_id,
                    position : exercice.Rubrique.position,
                    est_public: exercice.Rubrique.est_public
                }));

                const nouvelles_rubriques = [...nouveaux_liens, ...nouveaux_articles, ...nouvelles_videos, ...nouveaux_exercices];
                const rubriques_triees = nouvelles_rubriques.sort((a, b) => a.position - b.position);
                setRubrique(rubriques_triees[0]);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        if (localStorage.getItem('token')) {
            refresh();
        }

        fetchData();
    }, [id]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur: {error.message}</div>;
    }

    return (
        <div className="Main">
            <div className="Div_Title">
                {data && <img src={`/static/image/${data.image}`} alt="Logo" />}
                {data && <h1 dangerouslySetInnerHTML={{__html: data.nom}}></h1>}
            </div>{ rubrique && (
                rubrique.type === "lien" ? <Container_Lien rubrique={rubrique} /> :
                rubrique.type === "article" ? <Container_Article rubrique={rubrique} /> :
                rubrique.type === "video" ? <Container_Video rubrique={rubrique} /> :
                rubrique.type === "exercice" ? <Container_Exercice rubrique={rubrique} /> :
                null
            )}
            <button className="Button" onClick={() => window.location.href = `/page/${id}`}>Voir la page</button>
        </div>
    );
};

export default Main_Page_Preview;