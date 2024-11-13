import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

const Create_Categorie = () => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState(null);
    const [estPublic, setEstPublic] = useState(true);
    const [categorieId, setCategorieId] = useState(null);
    const navigate = useNavigate();
    const { id_categorie } = useParams();
    const { id_parent } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (id_categorie) {
            // Fetch the existing category details and set the state
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
                    console.log('Catégorie:', data);
                    setTitre(data.nom);
                    setDescription(data.description);
                    setImage(data.image);
                    setEstPublic(data.est_public);
                    setCategorieId(data.id);
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
            const images = categorieId ? image : '';

            const formData = new FormData();
            formData.append('nom', titre);
            formData.append('description', description);
            formData.append('est_public', estPublic);

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
            console.log(`Catégorie ${categorieId ? 'modifiée' : 'créée'}:`, data);
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
            navigate(`/categories/${data.id}`);
            window.location.reload();
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

    return (
        <div className="categorie">
            <h1>{categorieId ? 'Modifier' : 'Créer'} une catégorie</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Titre :
                    <input type="text" value={titre} onChange={event => setTitre(event.target.value)} required />
                </label>
                <label>
                    Description :
                    <textarea value={description} onChange={event => setDescription(event.target.value)} required />
                </label>
                <label>
                    <h3>Image actuelle</h3>
                    {image && <img src={"/static/image/"+image} alt="" style={{ maxWidth: '100%', height: 'auto' }} />}
                    <input type="text" value={imageFile ? imageFile.name : ''}/>
                    <input type="file" onChange={handleImageChange} accept="image/*" required />
                    {image && <img src={image} alt="Aperçu de l'image" style={{ maxWidth: '100%', height: 'auto' }} />}
                </label>
                <label>
                    Est public :
                    <input type="checkbox" checked={estPublic} onChange={event => setEstPublic(event.target.checked)} />
                </label>
                <button type="submit">{categorieId ? 'Modifier' : 'Créer'}</button>
            </form>
        </div>
    );
}

export default Create_Categorie;