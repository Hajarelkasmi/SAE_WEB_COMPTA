import React, { useState } from 'react';

const Container_Lien = ({ rubrique }) => {
    const [isModifiable, setIsModifiable] = useState(rubrique.isModifiable);
    const [titre, setTitre] = useState(rubrique.nom);
    const [description, setDescription] = useState(rubrique.description);
    const [lien, setLien] = useState(rubrique.lien);

    const handleModify = () => {
        setIsModifiable(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/liens/${rubrique.id}`, {
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
                throw new Error('Erreur lors de la mise à jour du lien');
            }
            setIsModifiable(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce lien ?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/liens/${rubrique.id}`, {
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

    return (
            <div className="Div_Lien">
                <div className="Div_Lien_Title">
                    {isModifiable ? (
                        <input
                            type="text"
                            value={titre}
                            onChange={(event) => setTitre(event.target.value)}
                            placeholder='Titre'
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
            {isModifiable ? (
                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder='Description'
                />
            ) : (
                <p>{description}</p>
            )}
            {isModifiable ? (
                <input
                    type="text"
                    value={lien}
                    onChange={(event) => setLien(event.target.value)}
                    placeholder='Lien'
                />
            ) : (
                <a href={lien}>{lien}</a>
            )}
        </div> 
    );
    
};

export default Container_Lien;