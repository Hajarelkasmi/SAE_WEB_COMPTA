import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Draggable from "react-draggable";
import Popup from "./Popup";
import '../css/Create_Categories.css';
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";





// les images ne s'enregistrent pas en bd si un fichier est nommé de la même manière dans /public/image/ -> à corriger





const Create_Categorie = () => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState(null);
    const [positionP, setPositionP] = useState({ x: 0, y: 0 });
    const [sizeP, setSizeP] = useState({ width: 200, height: 200 });
    const [resizeOffsetP, setResizeOffsetP] = useState({ deltaX: 0, deltaY: 0 });
    const [estPublic, setEstPublic] = useState(true);
    const [categorieId, setCategorieId] = useState(null);
    const navigate = useNavigate();
    const { id_categorie } = useParams();
    const { id_parent } = useParams();
    const [parentName, setParentName] = useState(null);

    // gestion image carrousel
    const [positionC, setPositionC] = useState({ x: 0, y: 0 });
    const [sizeC, setSizeC] = useState({ width: 200, height: 200 });
    const [resizeOffsetC, setResizeOffsetC] = useState({ deltaX: 0, deltaY: 0 });

    const handleResizeC = (event, { size }) => {
        console.log(sizeC, size);
        const deltaX = (sizeC.width - size.width) / 2;
        const deltaY = (sizeC.height - size.height) / 2;

        setResizeOffsetC((prevOffset) => ({
            deltaX: prevOffset.deltaX + deltaX,
            deltaY: prevOffset.deltaY + deltaY,
        }));

        setSizeC(size);
    };

    const handleResizeP = (event, { size }) => {
        console.log(sizeP, size);
        const deltaX = (sizeP.width - size.width) / 2;
        const deltaY = (sizeP.height - size.height) / 2;

        setResizeOffsetP((prevOffset) => ({
            deltaX: prevOffset.deltaX + deltaX,
            deltaY: prevOffset.deltaY + deltaY,
        }));

        setSizeP(size);
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
                    setImage("/static/image/" + data.image);
                    setEstPublic(data.est_public);
                    setCategorieId(data.id);

                    if (data.placement_image_page) {
                        const posP = JSON.parse(data.placement_image_page);
                        setPositionP({ x: posP.x, y: posP.y });
                        setSizeP({ width: posP.width, height: posP.height });
                        setResizeOffsetP({ deltaX: posP.decX, deltaY: posP.decY });
                    }
                    if (data.placement_image_carrousel) {
                        const posC = JSON.parse(data.placement_image_carrousel);
                        setPositionC({ x: posC.x, y: posC.y });
                        setSizeC({ width: posC.width, height: posC.height });
                        setResizeOffsetC({ deltaX: posC.decX, deltaY: posC.decY });
                    }
                } catch (error) {
                    console.error('Erreur:', error);
                }
            };
            fetchCategorie();
        }

        if (id_parent) {
            // Fetch the parent category name
            const fetchParentName = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/categories/${id_parent}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Erreur lors de la récupération de la catégorie parente');
                    }
                    const data = await response.json();
                    setParentName(data.nom);
                } catch (error) {
                    console.error('Erreur:', error);
                }
            };
            fetchParentName();
        }
    }, [id_categorie, id_parent]);

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
            formData.append('image', imageFile);
            formData.append('placement_image_carrousel', JSON.stringify({ x: positionC.x, y: positionC.y, width: sizeC.width, height: sizeC.height, decX: resizeOffsetC.deltaX, decY: resizeOffsetC.deltaY }));
            formData.append('placement_image_page', JSON.stringify({ x: positionP.x, y: positionP.y, width: sizeP.width, height: sizeP.height, decX: resizeOffsetP.deltaX, decY: resizeOffsetP.deltaY }));

            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: token
                },
                body: formData
            });

            if (!response.ok) {
                console.error('Erreur lors de la création de la catégorie:', response);
                const errorText = await response.text();
                throw new Error(`Erreur lors de la ${categorieId ? 'modification' : 'création'} de la catégorie: ${errorText}`);
            }
            const data = await response.json();

            const id_category = categorieId ? categorieId : data.id;

            const image_name = await imageSave(id_category);
            console.log(image_name);

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
                console.log(responseImage);

                if (!responseImage.ok) {
                    const errorText = await responseImage.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la création de la page');
                }
            }

            navigate(`/categories/${data.id}`);
            const message = categorieId ? 'Catégorie modifiée' : 'Catégorie créée';
            Popup(message, 2000, 'success');
        } catch (error) {
            console.error('Erreur:', error);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImage(URL.createObjectURL(file));
        }
    };

    const handleDragP = (e, data) => {
        setPositionP({ x: data.x, y: data.y });
    };

    const handleDragCarrousel = (e, data) => {
        setPositionC({ x: data.x, y: data.y });
    };

    useEffect(() => {
        // définir imageFile quand image est défini
        if (image) {
            fetch(image).then(res => res.blob()).then(blob => {
                let extension = image.split('.').pop();
                const file = new File([blob], `image.${extension}`, { type: 'image/' + extension });
                setImageFile(file);
            });
        }
    }, [image]);

    return (
        <div className="create-cat-main-div">
            {image ? (
            <>
                <p id="prev_img_titre">Prévisualisation de l'image sur la page</p>
                <div id="img-container">
                    <Draggable onDrag={handleDragP} cancel=".react-resizable-handle" defaultPosition={{ x: positionP.x, y: positionP.y }}>
                        <ResizableBox
                            width={sizeP.width}
                            height={sizeP.height}
                            minConstraints={[100, 100]} // Dimensions minimales
                            maxConstraints={[10000, 10000]} // Dimensions maximales
                            resizeHandles={["se", "sw", "ne", "nw"]} // Poignées de redimensionnement
                            onResize={handleResizeP}
                        >
                            <img
                            src={image}
                            alt="Aperçu de l'image"
                            style={{
                                top: positionP.y,
                                left: positionP.x,
                                width: `${sizeP.width}px`,
                                height: `${sizeP.height}px`,
                                objectFit: "fill",
                                cursor: "grab"
                                }}
                                draggable="false"/>
                        </ResizableBox>
                    </Draggable>
                </div>
                <p id="prev_img_carrousel_titre">Prévisualisation de l'image dans le carrousel</p>
                <div id="cont-carrousel">
                    <div id="square-container">
                        <div id="circle-container"></div>
                        <Draggable onDrag={handleDragCarrousel} cancel=".react-resizable-handle" defaultPosition={{ x: positionC.x, y: positionC.y }}>
                            <ResizableBox
                                width={sizeC.width}
                                height={sizeC.height}
                                minConstraints={[100, 100]} // Dimensions minimales
                                maxConstraints={[10000, 10000]} // Dimensions maximales
                                resizeHandles={["se", "sw", "ne", "nw"]} // Poignées de redimensionnement
                                onResize={handleResizeC}
                            >
                                <img
                                    src={image}
                                    alt="Aperçu de l'image"
                                    style={{
                                        top: positionC.y,
                                        left: positionC.x,
                                        width: `${sizeC.width}px`,
                                        height: `${sizeC.height}px`,
                                        objectFit: "fill",
                                        cursor: "grab",
                                    }}
                                    draggable="false" />
                            </ResizableBox>
                        </Draggable>
                    </div>
                </div>
            </>
                    ) : (
            <div id="placeholder_image_preview">
                <p>Ajoutez une image pour voir la prévisualisation</p>
            </div>  
            )}

            <h1 className="title-create-cat">{categorieId ? 'Modifier' : 'Créer'} une {id_parent ? 'sous catégorie de ' : 'catégorie'} {parentName}</h1>
            <form className="form-create-cat" onSubmit={handleSubmit}>
                <div className="create-cat-div">
                    <label className="label-create-cat" htmlFor="titre_choice">Titre :</label>
                    <input id="titre_choice" type="text" value={titre} onChange={event => setTitre(event.target.value)} required />
                </div>
                <div className="create-cat-div">
                    <label className="label-create-cat" htmlFor="ta-create-cat">Description :</label>
                    <textarea id="ta-create-cat" value={description} onChange={event => setDescription(event.target.value)} required />
                </div>
                <div className="create-cat-div">
                    <label className="label-create-cat" htmlFor="imageFile">Image actuelle :</label>
                    <input id="imageFile" type="file" onChange={handleImageChange} accept="image/*" required={!categorieId} />
                </div>
                <div className="create-cat-div">
                    <label className="label-create-cat" htmlFor="estPublic">Est public :</label>
                    <input id="estPublic" type="checkbox" checked={estPublic} onChange={event => setEstPublic(event.target.checked)} />
                </div>
                <button className="create_cat_button" type="submit">{categorieId ? 'Modifier' : 'Créer'}</button>
            </form>
        </div>
    );
};

export default Create_Categorie;
