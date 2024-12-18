import React, { useState } from 'react';
import "../css/Container_Exercice.css";
import Popup from './Popup';

const Container_Exercice = ({ rubrique, activeRubrique, handleEditRubrique, handleSwitchPosition, isAdmin }) => {
    const [isModifiable, setIsModifiable] = useState(activeRubrique === rubrique.rubrique_id);
    const [titre, setTitre] = useState(rubrique.nom);
    const [description, setDescription] = useState(rubrique.description);
    const [lien, setLien] = useState(rubrique.lien_fichier);
    const [file, setFile] = useState(null);

    const handleModify = () => {
        setIsModifiable(true);
        handleEditRubrique(rubrique.rubrique_id);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            let name = '';
            if (file) {
                name = await fileSave(rubrique.id);
            }

            const lien_fichier = file ? name : lien;

            const response = await fetch(`http://localhost:5000/api/exercices/${rubrique.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: titre,
                    description: description,
                    lien_fichier: lien_fichier,
                    rubrique_id: rubrique.rubrique_id,
                    page_id: rubrique.page_id,
                    est_public: rubrique.est_public,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la mise à jour de l\'exercice');
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
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet exercice ?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/exercices/${rubrique.id}`, {
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`,
                    },
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la suppression de l\'exercice');
                }
                handleEditRubrique();
                Popup('Exercice supprimé', 2000, 'success');
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLien(URL.createObjectURL(file));
            setFile(file);
        }
    }

    const fileSave = async (id) => {
        const token = localStorage.getItem('token');
        if (!file) {
            return;
        }
        const name = 'fichier_exercice_' + id + '.' + file.name.split('.').pop();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        const response = await fetch('http://localhost:5000/api/files', {
            headers: {
                'Authorization': token,
            },
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Réponse de l\'API:', errorText);
            throw new Error('Erreur lors de la sauvegarde du fichier');
        }
        return name;
    }


    return (
        <div className="container_exercice">
            <div className="container_exercice_header">
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
                    <div className="Div_Article_Buttons">
                        { isModifiable ? (
                        <button className='buttonMS' onClick={handleSave}>Enregistrer</button>
                        ) : (
                        <button className='buttonMS' onClick={handleModify}>Modifier</button>
                        )
                        }
                        <button className='buttonMS' onClick={handleDelete}>Supprimer</button>
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
            <div className="container_exercice_body">
                {isModifiable ?
                    <div>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleSave}>Sauvegarder</button>
                    </div>
                    :
                    <div>
                        <p>{rubrique.description}</p>
                        <iframe src={"/static/files/"+lien} title={titre} width="560" height="315" frameBorder="0" allowFullScreen loading='lazy'></iframe>
                    </div>
                }
            </div>
        </div>
    );

}

export default Container_Exercice;