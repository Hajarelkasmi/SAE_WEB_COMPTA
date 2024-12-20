import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Draggable from "react-draggable";
import Popup from "./Popup";
import '../css/Create_Categories.css';

const Create_Categorie = () => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [estPublic, setEstPublic] = useState(true);
    const [categorieId, setCategorieId] = useState(null);
    const navigate = useNavigate();
    const { id_categorie } = useParams();
    const { id_parent } = useParams();

    // const containerRef = useRef(null); // Référence au conteneur
    // const imageRef = useRef(null); // Référence à l'image

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (id_categorie) {
            const fetchCategorie = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/categories/${id_categorie}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Erreur lors de la récupération de la catégorie');
                    }
                    const data = await response.json();
                    console.log('Catégorie:', data); // temp
                    setTitre(data.nom);
                    setDescription(data.description);
                    setImage(data.image);
                    setEstPublic(data.est_public);
                    setCategorieId(data.id);

                    if (data.position) {
                        const pos = JSON.parse(data.position);
                        setPosition({ x: pos.x, y: pos.y });
                    }
                } catch (error) {
                    console.error('Erreur:', error);
                }
            };
            fetchCategorie();
        }
    }, [id_categorie]);

    const handleSubmit = async (event) => {
        const token = localStorage.getItem('token');
        event.preventDefault();
        try {
            const method = categorieId ? 'PUT' : 'POST';
            const url = categorieId ? `http://localhost:5000/api/categories/${categorieId}` : 'http://localhost:5000/api/categories';
            const images = categorieId ? image : ''; // temp

            const formData = new FormData();
            formData.append('nom', titre);
            formData.append('description', description);
            formData.append('est_public', estPublic);
            formData.append('position', JSON.stringify(position));
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur lors de la ${categorieId ? 'modification' : 'création'} de la catégorie: ${errorText}`);
            }
            const data = await response.json();
            // temp

            const id_category = categorieId ? categorieId : data.id;

            const image_name = await imageSave(id_category);

            if (image_name) {
                if (data.image) {
                    const deleteImage = await fetch('http://localhost:5000/api/images/' + data.image, {
                        'Authorization': token,
                        method: 'DELETE',
                    });
                    if (!deleteImage.ok) {
                        const errorText = await deleteImage.text();
                        console.error('Réponse de l\'API:', errorText);
                        throw new Error('Erreur lors de la suppression de l\'image');
                    }
                }
                const responseImage = await fetch('http://localhost:5000/api/categories/' + id_category, {
                    method: 'PUT',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image: image_name,
                    }),
                });

                if (!responseImage.ok) {
                    const errorText = await responseImage.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la création de la page');
                }
            }
            // temp
            console.log(`Catégorie ${categorieId ? 'modifiée' : 'créée'}:`, data);
            // temp
            if (id_parent) {
                const reponse_sous_categorie = await fetch(`http://localhost:5000/api/sous_categories`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    body: JSON.stringify({
                        id_parent: id_parent,
                        id_enfant: data.id
                    })
                });

                if (!reponse_sous_categorie.ok) {
                    const errorText = await reponse_sous_categorie.text();
                    throw new Error(`Erreur lors de la création de la sous-catégorie: ${errorText}`);
                }
                const data_sous_categorie = await reponse_sous_categorie.json();
                console.log('Sous-catégorie créée:', data_sous_categorie);
            }
            // temp
            navigate(`/categories/${data.id}`);
            const message = categorieId ? 'Catégorie modifiée' : 'Catégorie créée';
            Popup(message, 2000, 'success');
        } catch (error) {
            console.error('Erreur:', error);
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
        console.log(imageFile, id)
        const token = localStorage.getItem('token');
        if (!imageFile) {
            return;
        }
        const name = 'image_categorie_' + id + '.' + imageFile.name.split('.').pop();
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('name', name);
        const response = await fetch('http://localhost:5000/api/images', {
            headers: {
                'Authorization': token,
            },
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

    const handleDrag = (e, data) => {
        // const containerRect = containerRef.current.getBoundingClientRect();
        // const imageRect = imageRef.current.getBoundingClientRect();

        // // Dimensions de l'image et du conteneur
        // const maxX = containerRect.width - imageRect.width;
        // const maxY = containerRect.height - imageRect.height;

        // // Contraintes : éviter que l'image dépasse les bords
        // const newX = Math.max(0, Math.min(data.x, maxX));
        // const newY = Math.max(0, Math.min(data.y, maxY));

        // setPosition({ x: newX, y: newY });
        console.log(`Position: x=${data.x}, y=${data.y}`);
        setPosition({ x: data.x, y: data.y });
    };

    return (
        <div className="create-cat-main-div">
            <div id="img-container" >
                <Draggable position={position} onDrag={handleDrag}>
                    <img
                        src={"/static/image/" + image ? "/static/image/" + image : image}
                        alt="Aperçu de l'image"
                        style={{ top: position.y, left: position.x }}
                    />
                </Draggable>
            </div>
            {/* <div
                id="img-container"
                ref={containerRef}
            >
                {image && (
                    <Draggable
                        defaultPosition={position}
                        onDrag={handleDrag}
                    // bounds="parent"
                    >
                        <img
                            ref={imageRef}
                            src={"/static/image/" + image}
                            alt="Aperçu de l'image"
                            style={{
                                top: position.x,
                                left: position.y
                            }}
                        />
                    </Draggable>
                )}
            </div> */}

            <h1 className="title-create-cat">{categorieId ? 'Modifier' : 'Créer'} une catégorie</h1>
            <form className="form-create-cat" onSubmit={handleSubmit}>
                <div className="create-cat-div">
                    <label className="label-create-cat">Titre :</label>
                    <input type="text" value={titre} onChange={event => setTitre(event.target.value)} required />
                </div>
                <div className="create-cat-div">
                    <label className="label-create-cat">Description :</label>
                    <textarea id="ta-create-cat" value={description} onChange={event => setDescription(event.target.value)} required />
                </div>
                <div className="create-cat-div">
                    <label className="label-create-cat">Image actuelle :</label>
                    <input type="file" onChange={handleImageChange} accept="image/*" required={categorieId ? false : true} />
                </div>
                <div className="create-cat-div">
                    <label className="label-create-cat">Est public :</label>
                    <input type="checkbox" checked={estPublic} onChange={event => setEstPublic(event.target.checked)} />
                </div>
                <button className="create_cat_button" type="submit">{categorieId ? 'Modifier' : 'Créer'}</button>
            </form>
        </div>
    );
};

export default Create_Categorie;
