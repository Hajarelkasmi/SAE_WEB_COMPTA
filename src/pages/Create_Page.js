import React, { useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Create_Page.css';
import { refresh } from "./RefreshToken";
import Popup from "./Popup";
import {InfosContext} from "../InfosContext";

const Create_Page = () => {
    let { id_categorie, id_page } = useParams();
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [estPublic, setEstPublic] = useState(true);
    const [classes, setClasses] = useState([]);
    const [classe_selected, setClasse_selected] = useState([]);
    const [estCree, setEstCree] = useState(false);
    const [couleur, setCouleur] = useState('#000000');
    const navigate = useNavigate();
    const {IP_api} = useContext(InfosContext);


    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch(IP_api + '/api/classes');
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la récupération des classes');
                }
                const classes = await response.json();
                setClasses(classes);

                if (id_page) {
                    const page = await fetch(IP_api + '/api/pages/' + id_page, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token'),
                        },
                    });
                    if (!page.ok) {
                        const errorText = await page.text();
                        console.error('Réponse de l\'API:', errorText);
                        throw new Error('Erreur lors de la récupération de la page');
                    }
                    const pageData = await page.json();
                    let color = pageData.nom.match(/color:(.*);/);
                    if (color) {
                        setCouleur(color[1]);
                    }
                    setTitre(pageData.nom.replace(/<[^>]*>/g, ''));
                    setDescription(pageData.description);
                    setImage(pageData.image);
                    setEstPublic(pageData.est_public);
                    setEstCree(true);

                    const responseClassePage = await fetch(IP_api + '/api/classe_pages?page_id=' + id_page);
                    if (!responseClassePage.ok) {
                        const errorText = await responseClassePage.text();
                        console.error('Réponse de l\'API:', errorText);
                        throw new Error('Erreur lors de la récupération des classes_pages');
                    }
                    const classePages = await responseClassePage.json();
                    const classeSelected = classePages.map((classePage) => classes.find((classe) => classe.id === classePage.classe_id));
                    setClasse_selected(classeSelected);
                    return;
                }

                const responseClasseCategories = await fetch(IP_api + '/api/classe_categories?categorie_id=' + id_categorie);
                if (!responseClasseCategories.ok) {
                    const errorText = await responseClasseCategories.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la récupération des classes_categories');
                }
                const classeCategories = await responseClasseCategories.json();
                const classeSelected = classeCategories.map((classeCategory) => classes.find((classe) => classe.id === classeCategory.classe_id));
                setClasse_selected(classeSelected);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };
        if (localStorage.getItem('token')) {
            refresh();
        }

        fetchClasses();
    }
        , [id_categorie, id_page]);

    const addClasseSelected = (id) => {
        const classe = classes.find((classe) => classe.id === parseInt(id));
        if (!classe_selected.includes(classe)) {
            setClasse_selected([...classe_selected, classe]);
        }
    }

    const handleCreate = async () => {
        const token = localStorage.getItem('token');
        try {
            let response;
            if (id_categorie === 'null') {
                id_categorie = "";
            }
            const title_color = "<span style='color:" + couleur + ";'>" + titre + "</span>";
            if (id_page) {
                response = await fetch(IP_api + '/api/pages/' + id_page, {
                    method: 'PUT',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nom: title_color,
                        description: description,
                        est_public: estPublic,
                        categorie_id: id_categorie,
                    }),
                });
            } else {
                response = await fetch(IP_api + '/api/pages', {
                    method: 'POST',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nom: title_color,
                        description: description,
                        image: '',
                        est_public: estPublic,
                        categorie_id: id_categorie,
                    }),
                });
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la création de la page');
            }

            const newPage = await response.json();
            
            const message = id_page ? 'Page modifiée' : 'Page créée';
            Popup(message, 2000, 'success');

            if (id_page) {
                await modifClasses();
            } else {
                await createClasses(newPage);
            }

            const image_name = await imageSave(newPage.id || id_page);

            if (image_name) {
                if (newPage.image) {
                    const deleteImage = await fetch(IP_api + '/api/images/' + newPage.image, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': token,
                        },
                    });
                    if (!deleteImage.ok) {
                        const errorText = await deleteImage.text();
                        console.error('Réponse de l\'API:', errorText);
                        throw new Error('Erreur lors de la suppression de l\'image');
                    }
                }
                const responseImage = await fetch(IP_api + '/api/pages/' + newPage.id || id_page, {
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
            setTitre('');
            setDescription('');
            setImage('');
            setImageFile(null);
            navigate(`/page/${newPage.id}`);

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

    const createClasses = async (id_page) => {
        const token = localStorage.getItem('token');
        if (classe_selected.length > 0) {
            classe_selected.forEach(async (classe) => {
                const responseClassePage = await fetch(IP_api + '/api/classe_pages', {
                    method: 'POST',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        classe_id: classe.id,
                        page_id: id_page.id,
                    }),
                });

                if (!responseClassePage.ok) {
                    const errorText = await responseClassePage.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la création de la classe_page');
                }
            }
            );
        }
    }

    const modifClasses = async () => {
        const token = localStorage.getItem('token');
        const responseClassePage = await fetch(IP_api + '/api/classe_pages?page_id=' + id_page, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!responseClassePage.ok) {
            const errorText = await responseClassePage.text();
            console.error('Réponse de l\'API:', errorText);
            throw new Error('Erreur lors de la récupération de la classe_page');
        }

        const classePages = await responseClassePage.json();
        const alreadyExist = {};
        for (const classePage of classePages) {
            if (!(classe_selected.find((classe) => classe.id === classePage.classe_id))) {
                const responseDelete = await fetch(IP_api + '/api/classe_pages/' + classePage.classe_id + '/' + id_page, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });
                if (!responseDelete.ok) {
                    const errorText = await responseDelete.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la suppression de la classe_page');
                }
            } else {
                alreadyExist[classePage.classe_id] = true;
            }
        }

        classe_selected.forEach(async (classe) => {
            if (!alreadyExist[classe.id]) {
                const responseClassePage = await fetch(IP_api + '/api/classe_pages', {
                    method: 'POST',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        classe_id: classe.id,
                        page_id: id_page,
                    }),
                });
                if (!responseClassePage.ok) {
                    const errorText = await responseClassePage.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la création de la classe_page');
                }
            }
        });
    }

    const imageSave = async (id) => {
        const token = localStorage.getItem('token');
        if (!imageFile) {
            return;
        }
        const name = 'image_page_' + id + '.' + imageFile.name.split('.').pop();
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('name', name);
        const response = await fetch(IP_api + '/api/images', {
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

    return (
        <div className="div-page-all-content">
            {image ? (
                <div id="img-container">
                    <img src={image} alt="Aperçu de l'image" />
                    <img src={"/static/image/" + image} alt="Aperçu de l'image" />
                </div>
            ) : (
                <div id="img-container">
                    <p>Aperçu de l'image</p>
                </div>
            )}
            <div className="DivCreateMain">
                {estCree && <h1 className="titre-create">Modifier la page</h1> || <h1 className="titre-create">Créer une page</h1>}
                <div className="DivCreate">
                    <label className="label-create">
                        Titre de la page :
                    </label>
                    <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} />
                    <input type="color" value={couleur} onChange={(e) => setCouleur(e.target.value)} />
                </div>
                <div className="DivCreate">
                    <label>
                        Description de la page:
                    </label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="DivCreate">
                    <label>
                        Image d'en-tête:
                    </label>
                    <h3>Image actuelle</h3>
                    {image && <img src={"/static/image/" + image} alt="" style={{ maxWidth: '100%', height: 'auto' }} />}
                    <input type="text" value={imageFile ? imageFile.name : ''} />
                    <input type="file" onChange={handleImageChange} accept="image/*" />
                    {image && <img src={image} alt="Aperçu de l'image" style={{ display: 'none' }} />}
                </div>
                <div className="DivCreate">
                    <label className="label-create">
                        Est public :
                    </label>
                    <input type="checkbox" checked={estPublic} onChange={(e) => setEstPublic(e.target.checked)} />
                </div>
                <div className="DivCreate">
                    <label className="label-create">
                        Classe :
                    </label>
                    <select onChange={(e) => addClasseSelected(e.target.value)}>
                        <option value="" hidden>Choisissez une classe</option>
                        {classes.map((classe) => (
                            <option value={classe.id}>{classe.nom}</option>
                        ))}
                    </select>
                </div>
                <div className="DivCreate">
                    <label className="label-create">
                        Classes sélectionnées :
                    </label >
                    <ul>
                        {classe_selected.map((classe) => (
                            <li key={classe.id}>{classe.nom}<button onClick={() => setClasse_selected(classe_selected.filter((classe_selected) => classe_selected !== classe))}>Supprimer</button></li>
                        ))}
                    </ul>
                </div>
                <button onClick={handleCreate} className="ButtonCreate">{estCree && 'Modifier' || 'Créer'}</button>
            </div>
        </div >
    );
}

export default Create_Page;