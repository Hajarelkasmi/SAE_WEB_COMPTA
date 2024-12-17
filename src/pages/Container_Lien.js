import React, { useState } from 'react';
import "../css/Container_Lien.css";
import Popup from './Popup';


const Container_Lien = ({ rubrique, activeRubrique, handleEditRubrique, handleSwitchPosition, isAdmin }) => {
    const [isModifiable, setIsModifiable] = useState(activeRubrique === rubrique.rubrique_id);
    const [titre, setTitre] = useState(rubrique.nom);
    const [description, setDescription] = useState(rubrique.description);
    const [lien, setLien] = useState(rubrique.lien);

    const handleModify = () => {
        setIsModifiable(true);
        handleEditRubrique(rubrique.rubrique_id);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/liens/${rubrique.id}`, {
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
                    page_id: rubrique.page_id,
                    est_public: rubrique.est_public,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la mise à jour du lien');
            }
            setIsModifiable(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
        handleEditRubrique();
        Popup('Sauvegarde de la rubrique réussie', 2000, 'success');
        localStorage.removeItem('edit_rubrique');
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce lien ?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/liens/${rubrique.id}`, {
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`,
                    },
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la suppression du lien');
                }
                window.location.reload();

            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    }

    const handleDragStart = (event, position) => {
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
        handleSwitchPosition(position1, position2);
    };

    if (isAdmin === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-lien">
            <div className="Div_Lien"
                id={`article-${rubrique.rubrique_id}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="Div_Lien_Title">
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

                    {isAdmin ? (
                    <div className="Div_Liens_Buttons">
                        {isModifiable ? (
                            <button onClick={handleSave}>Enregistrer</button>
                        ) : (
                            <button onClick={handleModify} disabled={activeRubrique}>Modifier</button>
                        )}
                        <button onClick={handleDelete}>Supprimer</button>
                    </div>
                    ) : null}
                    {isAdmin ? (
                        isModifiable ? (
                            <input checked={rubrique.est_public} type="checkbox" onChange={(event) => {rubrique.est_public = event.target.checked;}} /> 
                        ) : (
                            <p>{rubrique.est_public ? 'Public' : 'Privé'}</p>
                        )
                    ) : null}
                </div>            
            {isModifiable && isAdmin ? (
                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder='Description'
                />
            ) : (
                <p>{description}</p>
            )}
            {isModifiable && isAdmin ? (
                <input
                    type="text"
                    value={lien}
                    onChange={(event) => setLien(event.target.value)}
                    placeholder='Lien'
                />
            ) : (
                <a href={lien}>{lien}</a>
            )}
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
        </div> // Add this closing tag
        
        );
        };
        
        export default Container_Lien;