import React, { useState } from 'react';
import "../css/Container_Video.css";

const Container_Video = ({ rubrique, activeRubrique, handleEditRubrique, handleSwitchPosition, isAdmin }) => {
    const [isModifiable, setIsModifiable] = useState(activeRubrique === rubrique.rubrique_id);
    const [titre, setTitre] = useState(rubrique.nom);
    const [description, setDescription] = useState(rubrique.description);
    const [lien, setLien] = useState(rubrique.lien);

    // Extraire l'ID de la vidéo YouTube à partir de l'URL
    const getYouTubeVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeVideoId(lien);
    const videoUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

    const handleModify = () => {
        setIsModifiable(true);
        handleEditRubrique(rubrique.rubrique_id);
    }

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/videos/${rubrique.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: titre,
                    description: description,
                    lien: lien,
                    rubrique_id: rubrique.rubrique_id,
                    page_id: rubrique.page_id
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la mise à jour de la vidéo');
            }
            setIsModifiable(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
        handleEditRubrique();
        localStorage.removeItem('edit_rubrique');
    }

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette vidéo ?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/videos/${rubrique.id}`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la suppression de la vidéo');
                }
                window.location.reload();

            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    }

    const handleDragStart = (event,position) => {
        event.dataTransfer.setData('position', position);
    };
    
    const handleDragOver = (event) => {
        event.preventDefault();
    };
    
    const handleDrop = async (event) => {
        if (!isAdmin) {
            return;
        }
        event.preventDefault();
        const position = event.dataTransfer.getData('position');
        const position1 = parseInt(position);
        const position2 = parseInt(rubrique.position);
        if (position1 === position2) {
            return;
        }
        handleSwitchPosition(position1,position2);
    };

    if (isAdmin === null) {
        (<div>loading . . . . . . . . .</div>)
    }

    return (
            <div className="Div_Video"
         id={`article-${rubrique.rubrique_id}`}
         onDragOver={handleDragOver} 
         onDrop={handleDrop}>
                <div className="Div_Video_Title">
                    {isModifiable && isAdmin ? (
                        <input
                            type="text"
                            value={titre}
                            onChange={(event) => setTitre(event.target.value)}
                            placeholder='Titre'
                        />
                    ) : (
                        <h2>{titre}</h2>
                    )}
                    { isAdmin ? (
                    <div className="Div_Video_Buttons">
                        {isModifiable ? (
                            <button onClick={handleSave}>Enregistrer</button>
                        ) : (
                            <button onClick={handleModify} disabled={activeRubrique}>Modifier</button>
                        )}
                        <button onClick={handleDelete}>Supprimer</button>
                    </div>
                    ) : null}
                </div>    
            <div className="Div_Video_Content">
            {isModifiable && isAdmin ? (
                <input
                    type="text"
                    value={lien}
                    onChange={(event) => setLien(event.target.value)}
                    placeholder='Lien de la vidéo'
                />
            ) : (
                <iframe
                    title={titre}
                    width="560"
                    height="315"
                    src={videoUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )}
            {isModifiable && isAdmin ? (
                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder='Description'
                />
            ) : (
                <p>{description}</p>
            )}

        </div>
            {isAdmin ? (
            <div className="Div_Position"
                draggable={true && !isModifiable} 
                onDragStart={(e) => handleDragStart(e, rubrique.position)} 
                style={{cursor: 'move', 
                    opacity: isModifiable ? 0.5 : 1, 
                    backgroundColor: 'lightgrey',
                    minHeight: '50px'}}>
            </div> 
            ) : null}

        </div>
    );
};

export default Container_Video;