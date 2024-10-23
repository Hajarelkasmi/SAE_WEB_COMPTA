import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Create_Page.css';

const Create_Page = ({ id }) => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [estPublic, setEstPublic] = useState(true);
    const [classes, setClasses] = useState([]);
    const [classe_selected, setClasse_selected] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/classes');
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la récupération des classes');
                }
                const classes = await response.json();
                setClasses(classes);

                const responseClasseCategories = await fetch('http://localhost:5000/api/classe_categories?categorie_id=' + id);
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
        fetchClasses();
    }
    , []);

    const addClasseSelected = (id) => {
        const classe = classes.find((classe) => classe.id === parseInt(id));
        if (!classe_selected.includes(classe)) {
            setClasse_selected([...classe_selected, classe]);
        }
    } 
 
    const handleCreate = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/pages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: titre,
                    description: description,
                    image: imageFile.name,
                    classe_id: id,
                    est_public: estPublic,
                    categorie_id: 1,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la création de la page');
            }

            const newPage = await response.json();
            setTitre('');
            setDescription('');
            setImage('');
            setImageFile(null);
            navigate(`/main/${newPage.id}`); 
                
            if (classe_selected.length > 0) {
                console.log('test');
                classe_selected.forEach(async (classe) => {
                    const responseClassePage = await fetch('http://localhost:5000/api/classe_pages', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            classe_id: classe.id,
                            page_id: newPage.id,
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

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const responseImage = await fetch('http://localhost:5000/api/images', {
                    method: 'POST',
                    body: formData,
                });

                if (!responseImage.ok) {
                    const errorText = await responseImage.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la sauvegarde de l\'image');
                }
            }
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

    return (
        <div class="DivCreateMain">
            <h2>Création d'une page</h2>
            <div class="DivCreate">
                <label>
                    Titre de la page :
                </label>
                <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} />
            </div>
            <div class="DivCreate">
                <label>
                    Description de la page:
                </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div class="DivCreate">
                <label>
                    Image de fond de la page:
                </label>
                <input type="text" value={imageFile ? imageFile.name : ''}/>
                <input type="file" onChange={handleImageChange} />
                {image && <img src={image} alt="Aperçu de l'image" style={{ maxWidth: '100%', height: 'auto' }} />}
            </div>
            <div class="DivCreate">
                <label>
                    Est public :
                </label>
                <input type="checkbox" checked={estPublic} onChange={(e) => setEstPublic(e.target.checked)} />
            </div>
            <div class="DivCreate">
                <label>
                    Classe :
                </label>
                <select onChange={(e) => addClasseSelected(e.target.value)}>
                    <option value="" hidden>Choisissez une classe</option>
                    {classes.map((classe) => (
                        <option value={classe.id}>{classe.nom}</option>
                    ))}
                </select>
            </div>
            <div class="DivCreate">
                <label>
                    Classes sélectionnées :
                </label>
                <ul>
                    {classe_selected.map((classe) => (
                        <li key={classe.id}>{classe.nom}<button onClick={() => setClasse_selected(classe_selected.filter((classe_selected) => classe_selected !== classe))}>Supprimer</button></li> 
                    ))}
                </ul>
            </div>
            <button onClick={handleCreate} class="ButtonCreate">Créer</button>
        </div>
    );
}

export default Create_Page;