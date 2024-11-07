import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

const Create_Categorie = () => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [estPublic, setEstPublic] = useState(true);
    const [categorieId, setCategorieId] = useState(null);
    const navigate = useNavigate();
    const { id_categorie } = useParams();
    const { id_parent } = useParams();

    useEffect(() => {
        if (id_categorie) {
            // Fetch the existing category details and set the state
            const fetchCategorie = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/categories/${id_categorie}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `${localStorage.getItem('token')}`
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
                } catch (error) {
                    console.error('Erreur:', error);
                }
            };
            fetchCategorie();
        }
    }, [id_categorie]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const method = categorieId ? 'PUT' : 'POST';
            const url = categorieId ? `http://localhost:5000/api/categories/${categorieId}` : 'http://localhost:5000/api/categories';

            const formData = new FormData();
            formData.append('nom', titre);
            formData.append('description', description);
            formData.append('image', image);
            formData.append('est_public', estPublic);

            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur lors de la ${categorieId ? 'modification' : 'création'} de la catégorie: ${errorText}`);
            }
            const data = await response.json();
            console.log(`Catégorie ${categorieId ? 'modifiée' : 'créée'}:`, data);
            if (id_parent) {
                const reponse_sous_categorie = await fetch(`http://localhost:5000/api/sous_categories`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${localStorage.getItem('token')}`
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
                    Image :
                    <input type="file" onChange={event => setImage(event.target.files[0])} required />
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