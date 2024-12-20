import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Draggable from "react-draggable";
import Popup from "./Popup";
import '../css/Create_Categories.css';
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const Create_Categorie = () => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [positionCarrousel, setPositionCarrousel] = useState({ xC: 0, yC: 0 });
    const [estPublic, setEstPublic] = useState(true);
    const [categorieId, setCategorieId] = useState(null);
    const navigate = useNavigate();
    const { id_categorie } = useParams();
    const { id_parent } = useParams();

    const [size, setSize] = useState({ width: 200, height: 200 });

    const handleResize = (event, { size }) => {
        setSize(size);
    };

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

            const formData = new FormData();
            formData.append('nom', titre);
            formData.append('description', description);
            formData.append('est_public', estPublic);
            formData.append('position', JSON.stringify(position));

            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: token
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur lors de la ${categorieId ? 'modification' : 'création'} de la catégorie: ${errorText}`);
            }
            const data = await response.json();

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

    const handleDrag = (e, data) => {
        console.log(`Position: x=${data.x}, y=${data.y}`);
        setPosition({ x: data.x, y: data.y });
    };

    const handleDragCarrousel = (e, data) => {
        console.log(`Position: x=${data.xC}, y=${data.yC}`);
        setPositionCarrousel({ xC: data.xC, yC: data.yC });
    };

    return (
        <div className="create-cat-main-div">
            <div id="img-container">
                <Draggable
                    onDrag={handleDrag}
                >
                    <img
                        src={image}
                        alt="Aperçu de l'image"
                        style={{
                            top: position.y,
                            left: position.x
                        }}
                    />
                </Draggable>

            </div>
            <div id="cont-carrousel">
                <div id="square-container">
                    <div id="circle-container"></div>
                    <Draggable onDrag={handleDragCarrousel}>
                        <ResizableBox
                            width={size.width}
                            height={size.height}
                            minConstraints={[100, 100]} // Dimensions minimales
                            maxConstraints={[10000, 10000]} // Dimensions maximales
                            resizeHandles={["se", "sw", "ne", "nw"]} // Poignées de redimensionnement
                            onResize={handleResize}
                        >
                            <img
                                src={image}
                                alt="Aperçu de l'image"
                                style={{
                                    width: `${size.width}px`,
                                    height: `${size.height}px`,
                                    objectFit: "fill"
                                }}
                            />
                        </ResizableBox>
                    </Draggable>
                </div>
            </div>

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
