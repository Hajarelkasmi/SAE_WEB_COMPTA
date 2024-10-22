import React, { useState } from 'react';

const Container_Video = ({ rubrique }) => {
    const [isModifiable, setIsModifiable] = useState(rubrique.isModifiable);
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
    }

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/videos/${rubrique.id}`, {
                method: 'PUT',
                headers: {
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
    }

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette vidéo ?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/videos/${rubrique.id}`, {
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

    return (
            <div className="Div_Video">
                <div className="Div_Video_Title">
                    {isModifiable ? (
                        <input
                            type="text"
                            value={titre}
                            onChange={(event) => setTitre(event.target.value)}
                        />
                    ) : (
                        <h2>{titre}</h2>
                    )}
                    {isModifiable ? (
                        <button onClick={handleSave}>Enregistrer</button>
                    ) : (
                        <button onClick={handleModify}>Modifier</button>
                    )}
                    <button onClick={handleDelete}>Supprimer</button>
                </div>    
            <div className="Div_Video_Content">
            {isModifiable ? (
                <input
                    type="text"
                    value={lien}
                    onChange={(event) => setLien(event.target.value)}
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
            {isModifiable ? (
                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            ) : (
                <p>{description}</p>
            )}

        </div>
        </div>
    );
};

export default Container_Video;