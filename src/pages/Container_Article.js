import React, { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import 'react-quill/dist/quill.snow.css';
import "../css/Container.Article.css";

const Container_Article = ({ rubrique, activeRubrique, handleEditRubrique, handleSwitchPosition, isAdmin }) => {
    const [isModifiable, setIsModifiable] = useState(activeRubrique === rubrique.rubrique_id);
    const [titre, setTitre] = useState(rubrique.nom);
    const [description, setDescription] = useState(rubrique.description);
    const [texte, setTexte] = useState(rubrique.texte);
    const [image, setImage] = useState(rubrique.image);
    const [imageFile, setImageFile] = useState(null);
    const { quill, quillRef } = useQuill();

    const handleModify = () => {
        setIsModifiable(!isModifiable);
        handleEditRubrique(rubrique.rubrique_id);
    };

    const insertToEditor = (url) => {
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', url);
    };

    const saveToServer = async (file) => {
        const body = new FormData();
        body.append('image', file);
        insertToEditor("/static/image/" + file.name);
        await handleSave();
        localStorage.setItem('edit_rubrique', rubrique.rubrique_id);
        await fetch('http://localhost:5000/api/images_rubrique', {
            method: 'POST',
            headers: {
                'Authorization': `${localStorage.getItem('token')}`,
            },
            body,
        });
    };
    
    const selectLocalImage = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
    
        input.onchange = async (e) => {
            const file = input.files[0];
            await saveToServer(file);

        };
    };

    useEffect(() => {
        if (quill) {
            quill.getModule('toolbar').addHandler('image', selectLocalImage);
            quill.clipboard.dangerouslyPasteHTML(texte);
            quill.on('text-change', () => {
                setTexte(quill.root.innerHTML);
            });
        }
    }, [quill]);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/articles/${rubrique.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: titre,
                    description: description,
                    texte: document.querySelector('.ql-editor').innerHTML,
                    page_id: rubrique.page_id,
                    rubrique_id: rubrique.rubrique_id,
                    est_public: rubrique.est_public,
                }),
            });

            const image_name = await imageSave(rubrique.rubrique_id);
            if (image_name) {
                if (response.image) {
                    const deleteImage = await fetch('http://localhost:5000/api/images/' + response.image, {
                        headers: {
                            'Authorization': `${token}`,
                        },
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
                        'Authorization': `${token}`,
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
        handleEditRubrique();
        localStorage.removeItem('edit_rubrique');
        window.location.reload();
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet article ?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/articles/${rubrique.id}`, {
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`,
                    },
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
            headers: {
                'Authorization': `${localStorage.getItem('token')}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Réponse de l\'API:', errorText);
            throw new Error('Erreur lors de la sauvegarde de l\'image');
        }
        return name;
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
        <div className="Div_Article" 
         id={`article-${rubrique.rubrique_id}`}
         onDragOver={handleDragOver} 
         onDrop={handleDrop}>
        
            <div className="Div_Article_Title">
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
            {isModifiable && isAdmin ? (
                <div>
                    <div>
                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder='Description'
                        />
                        <div ref={quillRef} class="quill-editor" />
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept='image/*'
                        />
                        {imageFile ? <img src={image} alt={titre} /> : <img src={"/static/image/" + image} alt={titre} />}
                    </div>
                </div>
            ) : (
                <div>
                    <p>{description}</p>
                    <div dangerouslySetInnerHTML={{ __html: texte }} />
                    {image ? <img src={"/static/image/" + image} alt={titre} /> : null}
                </div>
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
    );
};

export default Container_Article;