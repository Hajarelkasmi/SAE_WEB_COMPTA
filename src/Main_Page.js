import React, { useState, useEffect } from 'react';
import Container_Lien from './Container_Lien';
import Container_Article from './Container_Article';
import Container_Video from './Container_Video';
import Container_Exercice from './Container_Exercice';
import './Main_Page.css';

const Main_Page = ({ id }) => {
    const isAdmin = true;
    const [isChoosingRubrique, setIsChoosingRubrique] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rubriques, setRubriques] = useState([]); // État initial défini comme un tableau vide

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch page data
                const response = await fetch(`http://localhost:5000/api/pages/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);

                // Fetch rubriques data
                const liens_response = await fetch(`http://localhost:5000/api/liens?page_id=${id}`);
                if (!liens_response.ok) {
                    throw new Error(`HTTP error! status: ${liens_response.status}`);
                }
                const liens_result = await liens_response.json();
                const nouveaux_liens = liens_result.map((lien) => ({
                    id: lien.id,
                    nom: lien.Rubrique.nom,
                    description: lien.Rubrique.description,
                    lien: lien.lien,
                    type: "lien"
                }));
                const articles_response = await fetch(`http://localhost:5000/api/articles?page_id=${id}`);
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
                    page_id : article.Rubrique.page_id
                }));
                const videos_response = await fetch(`http://localhost:5000/api/videos?page_id=${id}`);
                if (!videos_response.ok) {
                    throw new Error(`HTTP error! status: ${videos_response.status}`);
                }
                const videos_result = await videos_response.json();
                const nouveaux_videos = videos_result.map((video) => ({
                    id: video.id,
                    nom: video.Rubrique.nom,
                    description: video.Rubrique.description,
                    lien: video.lien,
                    type: "video"
                }));
                const exercices_response = await fetch(`http://localhost:5000/api/exercices?page_id=${id}`);
                if (!exercices_response.ok) {
                    throw new Error(`HTTP error! status: ${exercices_response.status}`);
                }
                const exercices_result = await exercices_response.json();
                const nouveaux_exercices = exercices_result.map((exercice) => ({
                    id: exercice.id,
                    nom: exercice.Rubrique.nom,
                    description: exercice.Rubrique.description,
                    texte: exercice.texte,
                    lien_fichier: exercice.lien_fichier,
                    type: "exercice"
                }));
                const nouvelles_rubriques = [...nouveaux_liens, ...nouveaux_articles, ...nouveaux_videos, ...nouveaux_exercices];
                setRubriques(nouvelles_rubriques);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAddRubriqueLien = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/liens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: '',
                    description: '',
                    lien: '',
                    page_id: id
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la création du lien');
            }

            const result = await response.json();
            
            setRubriques([...rubriques, {
                id: result.id,
                nom: '',
                description: '',
                lien: '',
                type: "lien",
                isModifiable: true,
            }]);
            console.log(rubriques);
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    const handleAddRubriqueArticle = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: '',
                    description: '',
                    texte: '',
                    image: '',
                    page_id: id
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la création de l\'article');
            }

            const result = await response.json();

            console.log(result);

            setRubriques([...rubriques, {
                id : result.id,
                nom: '',
                description: '',
                texte: '',
                image: '',
                type: "article",
                isModifiable: true,
                page_id: id
            }]);

            console.log(rubriques);

            
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    const handleAddRubriqueVideo = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/videos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: '',
                    description: '',
                    lien: '',
                    page_id: id
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la création de la vidéo');
            }

            setRubriques([...rubriques, {
                id: response.id,
                nom: '',
                description: '',
                lien: '',
                type: "video",
                isModifiable: true
            }]);
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    const handleAddRubriqueExercice = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/exercices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: '',
                    description: '',
                    texte: '',
                    lien_fichier: '',
                    page_id: id
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la création de l\'exercice');
            }

            setRubriques([...rubriques, {
                id: response.id,
                nom: '',
                description: '',
                texte: '',
                lien_fichier: '',
                type: "exercice",
                isModifiable: true,
                page_id: id
            }]);
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
    
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
                {data && <h1>{data.nom}</h1>}
            </div>
            <div className="Div_Content">
                {data && <p>{data.description}</p>}
            </div>
            <div className="Div_Rubriques">
                {
                    rubriques.map((rubrique) => (
                        rubrique.type === "lien" ? (
                            <Container_Lien key={rubrique.id} rubrique={rubrique} />
                        ) : rubrique.type === "article" ? (
                            <Container_Article key={rubrique.id} rubrique={rubrique} />
                        ) : rubrique.type === "video" ? (
                            <Container_Video key={rubrique.id} rubrique={rubrique} />
                        ) :  rubrique.type === "exercice" ? (
                            <Container_Exercice key={rubrique.id} rubrique={rubrique} />
                        ) : null
                    ))
                }
            </div>
            { isAdmin && (
                <div className="Div_Admin">
                    
                    {isChoosingRubrique ? (
                        <div>
                            <button onClick={handleAddRubriqueVideo}>Vidéo</button>
                            <button onClick={handleAddRubriqueArticle}>Article</button>
                            <button onClick={handleAddRubriqueLien}>Lien</button>
                            <button onClick={handleAddRubriqueExercice}>Exercice</button>
                        </div>
                    ) : (
                        <button onClick={() => setIsChoosingRubrique(true)}>Ajouter une rubrique</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Main_Page;