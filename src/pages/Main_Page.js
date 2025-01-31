import React, {useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container_Lien from './Container_Lien';
import Container_Article from './Container_Article';
import Container_Video from './Container_Video';
import Container_Exercice from './Container_Exercice';
import '../css/Main_Page.css';
import {refresh} from "./RefreshToken";
import {InfosContext} from "../InfosContext";

const Main_Page = ({id_page}) => {  
    let { id } = useParams();
    id = id|| id_page;
    const [isChoosingRubrique, setIsChoosingRubrique] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rubriques, setRubriques] = useState([]);
    const [activeRubrique, setActiveRubrique] = useState(parseInt(localStorage.getItem('edit_rubrique')) || null);
    const navigate = useNavigate();
    const {isAdmin, IP_api} = useContext(InfosContext);
    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(IP_api + `/api/pages/${id}`, {
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

                const liens_response = await fetch(IP_api + `/api/liens?page_id=${id}`, {
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

                const articles_response = await fetch(IP_api + `/api/articles?page_id=${id}`, {
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
                
                const videos_response = await fetch(IP_api + `/api/videos?page_id=${id}`, {
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

                const exercices_response = await fetch(IP_api + `/api/exercices?page_id=${id}`, {
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
                setRubriques(nouvelles_rubriques);
                const rubriques_triees = nouvelles_rubriques.sort((a, b) => a.position - b.position);
                setRubriques(rubriques_triees);
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

    const handleAddRubriqueLien = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(IP_api + '/api/liens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify({
                    nom: '',
                    description: '',
                    lien: '',
                    page_id: id,
                    est_public: true
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
                page_id: id,
                rubrique_id: result.rubrique_id,
                est_public: true,
            }]);
            setActiveRubrique(result.rubrique_id);
            
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    const handleAddRubriqueArticle = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(IP_api + '/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify({
                    nom: '',
                    description: '',
                    texte: '',
                    image: '',
                    alt_image: '',
                    page_id: id,
                    est_public: true
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la création de l\'article');
            }

            const result = await response.json();

            setRubriques([...rubriques, {
                id : result.id,
                nom: '',
                description: '',
                texte: '',
                image: '',
                type: "article",
                isModifiable: true,
                page_id: id,
                rubrique_id: result.rubrique_id,
                position: result.position,
                est_public: true
            }]);
            setActiveRubrique(result.rubrique_id);
            setIsChoosingRubrique(false);

            
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    const handleAddRubriqueVideo = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(IP_api + '/api/videos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify({
                    nom: '',
                    description: '',
                    lien: '',
                    page_id: id,
                    est_public: true
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la création de la vidéo');
            }

            const result = await response.json();

            setRubriques([...rubriques, {
                id: result.id,
                nom: '',
                description: '',
                lien: '',
                type: "video",
                isModifiable: true,
                page_id: id,
                rubrique_id: result.rubrique_id,
                est_public: true
            }]);
            setActiveRubrique(result.rubrique_id);
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    const handleAddRubriqueExercice = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(IP_api + '/api/exercices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify({
                    nom: '',
                    description: '',
                    texte: '',
                    lien_fichier_exercice: '',
                    lien_fichier_correction: '',
                    page_id: id,
                    est_public: true
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la création de l\'exercice');
            }

            const result = await response.json();

            setRubriques([...rubriques, {
                id: result.id,
                nom: '',
                description: '',
                texte: '',
                lien_fichier_exercice: '',
                lien_fichier_correction: '',
                type: "exercice",
                isModifiable: true,
                page_id: id,
                rubrique_id: result.rubrique_id,
                est_public: true
            }]);
            setActiveRubrique(result.rubrique_id);
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    const handleEditRubrique = (id) => {
        if (id) {
            setActiveRubrique(id);
        } else {
            setActiveRubrique(null);
        }
    }

    const handleSwitchPosition = (position1, position2) => {
        const rubriques_triees = [...rubriques];
        const [movedRubrique] = rubriques_triees.splice(position1, 1);
        rubriques_triees.splice(position2, 0, movedRubrique);

        rubriques_triees.forEach((rubrique, index) => {
            rubrique.position = index;
            rubrique.positionModifiee = true;
        });

        setRubriques(rubriques_triees);
    };

    const handleSauvegarderPosition = async (rubriques) => {
        const token = localStorage.getItem('token');
        try {
            for (let i = 0; i < rubriques.length; i++) {
                const rubrique = rubriques[i];
                if (rubrique.positionModifiee) {
                    const response = await fetch(IP_api + `/api/${rubrique.type}s/${rubrique.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${token}`
                        },
                        body: JSON.stringify({
                            rubrique_id: rubrique.rubrique_id,
                            position: rubrique.position
                        }),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Réponse de l\'API:', errorText);
                        throw new Error('Erreur lors de la sauvegarde de la position');
                    }
                }
            }
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
            {isAdmin && !isPreview && (
                <div className="Div_Admin">
                    <button onClick={() => navigate('/categories/' + data.categorie_id + '/pages/' + id)}>Modifier</button>
                </div>
            )}
            <div className="Div_Title">
                {data && <img src={`/static/image/${data.image}`} alt="Logo" />}
                {data && <h1 dangerouslySetInnerHTML={{__html: data.nom}}></h1>}
            </div>
            { isAdmin && isPreview ? (
                    <button onClick={() => setIsPreview(false)}>Quitter la prévisualisation</button>
                ) : isAdmin && (
                    <button onClick={() => setIsPreview(true)}>Prévisualiser</button> 
            )}
            <div className="Div_Content">
                {data && <p>{data.description}</p>}
            </div>
            <div className="Div_Rubriques">
                {
                    rubriques.map((rubrique) => (
                        rubrique.type === "lien" ? (
                            <Container_Lien key={rubrique.id} rubrique={rubrique} activeRubrique={activeRubrique} handleEditRubrique={handleEditRubrique} handleSwitchPosition={handleSwitchPosition} isAdmin={isAdmin && !isPreview} />
                        ) : rubrique.type === "article" ? (
                            <Container_Article key={rubrique.id} rubrique={rubrique} activeRubrique={activeRubrique} handleEditRubrique={handleEditRubrique} handleSwitchPosition={handleSwitchPosition} isAdmin={isAdmin && !isPreview}/>
                        ) : rubrique.type === "video" ? (
                            <Container_Video key={rubrique.id} rubrique={rubrique} activeRubrique={activeRubrique} handleEditRubrique={handleEditRubrique} handleSwitchPosition={handleSwitchPosition} isAdmin={isAdmin && !isPreview}/>
                        ) :  rubrique.type === "exercice" ? (
                            <Container_Exercice key={rubrique.id} rubrique={rubrique} activeRubrique={activeRubrique} handleEditRubrique={handleEditRubrique} handleSwitchPosition={handleSwitchPosition} isAdmin={isAdmin && !isPreview}/>
                        ) : null
                    ))
                }
            </div>
            { isAdmin && !isPreview && (
                <div className="Div_Admin">
                    
                    {isChoosingRubrique ? (
                        <div>
                            <button onClick={handleAddRubriqueVideo} disabled={activeRubrique !== null}>Vidéo</button>
                            <button onClick={handleAddRubriqueArticle} disabled={activeRubrique !== null}>Article</button>
                            <button onClick={handleAddRubriqueLien} disabled={activeRubrique !== null}>Lien</button>
                            <button onClick={handleAddRubriqueExercice} disabled={activeRubrique !== null}>Exercice</button>
                        </div>
                    ) : (
                        <div>
                            <button onClick={() => setIsChoosingRubrique(true)} disabled={activeRubrique !== null}>Ajouter une rubrique</button>
                            <button onClick={() => handleSauvegarderPosition(rubriques)}>Sauvegarder la position</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Main_Page;