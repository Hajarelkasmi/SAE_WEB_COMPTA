import React, { useState } from 'react';
import "../css/Container_Exercice.css";
import Popup from './Popup';

const Container_Exercice = ({ rubrique, activeRubrique, handleEditRubrique, handleSwitchPosition, isAdmin }) => {
    const [isModifiable, setIsModifiable] = useState(activeRubrique === rubrique.rubrique_id);
    const [titre, setTitre] = useState(rubrique.nom);
    const [description, setDescription] = useState(rubrique.description);
    const [lienExercice, setLienExercice] = useState(rubrique.lien_fichier_exercice);
    const [fileExercice, setFileExercice] = useState(null);
    const [lienCorrection, setLienCorrection] = useState(rubrique.lien_fichier_correction);
    const [fileCorrection, setFileCorrection] = useState(null);

    const handleModify = () => {
        setIsModifiable(true);
        handleEditRubrique(rubrique.rubrique_id);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const nameExercice = await fileExerciceSave(rubrique.id);
            const nameCorrection = await fileCorrectionSave(rubrique.id);
            
            const response = await fetch(`http://localhost:5000/api/exercices/${rubrique.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: titre,
                    description: description,
                    lien_fichier_exercice: nameExercice,
                    lien_fichier_correction: nameCorrection,
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

    const handleFileExerciceChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLienExercice(URL.createObjectURL(file));
            setFileExercice(file);
        }
    }

    const handleFileCorrectionChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLienCorrection(URL.createObjectURL(file));
            setFileCorrection(file);
        }
    }

    const fileExerciceSave = async (id) => {
        const token = localStorage.getItem('token');
        if (!fileExercice) {
            return;
        }
        const name = 'fichier_exercice_' + id + '.' + fileExercice.name.split('.').pop();
        const formData = new FormData();
        formData.append('file', fileExercice);
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

    const fileCorrectionSave = async (id) => {
        const token = localStorage.getItem('token');
        if (!fileCorrection) {
            return;
        }
        const name = 'fichier_correction_' + id + '.' + fileCorrection.name.split('.').pop();
        const formData = new FormData();
        formData.append('file', fileCorrection);
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
        if (position1 === position2 || isNaN(position1) || isNaN(position2)) {
            return;
        }
        handleSwitchPosition(position1, position2);
    };

    return (
        <div className="container_exercice">
        <div className="Div_Exercice"
            id={`article-${rubrique.rubrique_id}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="Div_Exercice_Title">
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
                    <div className="Div_Exercice_Buttons">
                        { isModifiable ? (
                        <button onClick={handleSave}>Enregistrer</button>
                        ) : (
                        <button onClick={handleModify}>Modifier</button>
                        )
                        }
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
                {isModifiable ?
                    <div>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        <input type="file" onChange={handleFileExerciceChange} />
                        <input type="file" onChange={handleFileCorrectionChange} />
                    </div>
                    :
                    <div>
                        <p>{rubrique.description}</p>
                        <iframe src={"/static/files/"+lienExercice} title={titre} width="560" height="315" frameBorder="0" allowFullScreen loading='lazy'></iframe>
                        <a href={"/static/files/"+lienExercice} download={lienExercice}>Télécharger l'exercice</a>
                        <a href={"/static/files/"+lienCorrection} download={lienCorrection}>Télécharger la correction</a>
                    </div>
                }
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
        </div>
    );

}

export default Container_Exercice;