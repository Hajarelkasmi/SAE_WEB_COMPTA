import React, { useState } from 'react';

const Container_Article = ({ rubrique }) => {
    const [isModifiable, setIsModifiable] = useState(rubrique.isModifiable);
    const [titre, setTitre] = useState(rubrique.nom);
    const [description, setDescription] = useState(rubrique.description);
    const [texte, setTexte] = useState(rubrique.texte);
    const [image, setImage] = useState(rubrique.image);

    const handleModify = () => {
        setIsModifiable(!isModifiable);
    };

    const handleSave = async () => {
        try {
            console.log(rubrique.id);
            console.log(rubrique.nom, rubrique.description, rubrique.texte, rubrique.image);
            const response = await fetch(`http://localhost:5000/api/articles/${rubrique.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: titre,
                    description: description,
                    texte: texte,
                    image: image,
                    page_id: rubrique.page_id,
                    rubrique_id: rubrique.rubrique_id
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la mise à jour de l\'article');
            }
            setIsModifiable(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet article ?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/articles/${rubrique.id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la suppression de l\'article');
                }
                window.location.reload();

            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    };

    return (
        <li>
            <div className="Div_Article">
                <div className="Div_Article_Title">
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
                {isModifiable ? (
                    <div>
                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                        <textarea
                            value={texte}
                            onChange={(event) => setTexte(event.target.value)}
                        />
                        <input
                            type="text"
                            value={image}
                            onChange={(event) => setImage(event.target.value)}
                        />
                    </div>
                ) : (
                    <div>
                        <p>{description}</p>
                        <p>{texte}</p>
                        {image ? <img src={image} alt={titre} /> : null}
                    </div>
                )}
            </div>
        </li>
    );
};

export default Container_Article;