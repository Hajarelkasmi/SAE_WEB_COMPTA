import React, { useState } from 'react';

const Container_Article = ({ rubrique }) => {
    const [isModifiable, setIsModifiable] = useState(rubrique.isModifiable);
    const [titre, setTitre] = useState(rubrique.nom);
    const [description, setDescription] = useState(rubrique.description);
    const [texte, setTexte] = useState(rubrique.texte);
    const [image, setImage] = useState(rubrique.image);
    const [imageFile, setImageFile] = useState(null);

    const handleModify = () => {
        setIsModifiable(!isModifiable);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/articles/${rubrique.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: titre,
                    description: description,
                    texte: texte,
                    page_id: rubrique.page_id,
                    rubrique_id: rubrique.rubrique_id
                }),
            });

            const image_name = await imageSave(rubrique.rubrique_id);
            if (image_name) {
                if (response.image) {
                    const deleteImage = await fetch('http://localhost:5000/api/images/' + response.image, {
                        method: 'DELETE',
                    });
                    if (!deleteImage.ok) {
                        const errorText = await deleteImage.text();
                        console.error('Réponse de l\'API:', errorText);
                        throw new Error('Erreur lors de la suppression de l\'image');
                    }
                }
                const responseImage = await fetch(`http://localhost:5000/api/articles/${rubrique.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image: image_name,
                        rubrique_id: rubrique.rubrique_id 
                    }),
                });

                if (!responseImage.ok) {
                    const errorText = await responseImage.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la mise à jour de l\'article');
                }
                setImage(image_name);
            }

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImage(URL.createObjectURL(file));
        }
    };

    const imageSave = async (id) => {
        if (!imageFile) {
            return;
        }
        const name = 'image_rubrique_' + id + '.' + imageFile.name.split('.').pop();
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('name', name);
        const response = await fetch('http://localhost:5000/api/images', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Réponse de l\'API:', errorText);
            throw new Error('Erreur lors de la sauvegarde de l\'image');
        }
        return name;
    }

    return (
        <div className="Div_Article">
            <div className="Div_Article_Title">
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
                <div>
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder='Description'
                    />
                    <textarea
                        value={texte}
                        onChange={(event) => setTexte(event.target.value)}
                        placeholder='Texte'
                    />
                    <input
                        type="file"
                        onChange={handleImageChange}
                        accept='image/*'
                    />
                    {imageFile ? <img src={image} alt={titre} /> : <img src={"/static/image/" + image} alt={titre} />}
                </div>
            ) : (
                <div>
                    <p>{description}</p>
                    <p>{texte}</p>
                    {image ? <img src={"/static/image/" + image} alt={titre} /> : null}
                </div>
            )}
        </div>
    );
};

export default Container_Article;