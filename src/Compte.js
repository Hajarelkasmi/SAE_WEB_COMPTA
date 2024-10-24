import {useEffect, useState} from "react";

function Compte() {
    const [comptes, setComptes] = useState([]);
    const [classes, setClasses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    async function fetchComptes() {
        try {
            let response = await fetch('http://localhost:5000/api/etudiants');
            let data = await response.json();
            setComptes(data);
        } catch (error) {
            console.error('Error fetching comptes:', error);
        }
    }

    async function fetchClasses() {
        try {
            let response = await fetch('http://localhost:5000/api/classes');
            let data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    }

    useEffect(() => {
        fetchComptes().catch(r => console.error("Erreur", r));
        fetchClasses().catch(r => console.error("Erreur", r));
    }, []);

    async function deleteCompte(id) {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ?");
        if (!confirmed) {
            return;
        }

        await fetch(`http://localhost:5000/api/etudiants/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(r => console.error("Erreur", r));

        fetchComptes().catch(r => console.error("Erreur", r));
    }

    function editCompte(compte) {
        setIsEditing(true);
        setFormData(compte);
    }

    async function updateCompte(id) {
        await fetch(`http://localhost:5000/api/etudiants/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).catch(r => console.error("Erreur", r));

        fetchComptes().catch(r => console.error("Erreur", r));
        setIsEditing(false);
    }

    function handleChange(e) {
        const {name, value, type, checked} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    return (
        <div>
            <h2>Gestion des comptes</h2>
            <table>
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Mail</th>
                    <th>Mot de passe</th>
                    <th>Classe</th>
                    <th>Abonné</th>
                    <th>Admin</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {comptes.map(compte => (
                    <tr key={compte.id}>
                        <td>
                            {isEditing && formData.id === compte.id ? (
                                <input type="text" name="nom" value={formData.nom} onChange={handleChange}/>
                            ) : (
                                compte.nom
                            )}
                        </td>
                        <td>
                            {isEditing && formData.id === compte.id ? (
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange}/>
                            ) : (
                                compte.prenom
                            )}
                        </td>
                        <td>
                            {isEditing && formData.id === compte.id ? (
                                <input type="text" name="mail" value={formData.mail} onChange={handleChange}/>
                            ) : (
                                compte.mail
                            )}
                        </td>
                        <td>
                            {isEditing && formData.id === compte.id ? (
                                <input type="text" name="mot_de_passe" value={formData.mot_de_passe}
                                       onChange={handleChange}/>
                            ) : (
                                compte.mot_de_passe
                            )}
                        </td>
                        <td>
                            {isEditing && formData.id === compte.id ? (
                                <select name="classe_id" value={formData.classe_id} onChange={handleChange}>
                                    {classes.map(classe => (
                                        <option key={classe.id} value={classe.id}>{classe.nom}</option>
                                    ))}
                                </select>
                            ) : (
                                compte.Classe.nom
                            )}
                        </td>
                        <td>
                            {isEditing && formData.id === compte.id ? (
                                <input type="checkbox" name="est_abonne" checked={formData.est_abonne}
                                       onChange={handleChange}/>
                            ) : (
                                compte.est_abonne ? 'Oui' : 'Non'
                            )}
                        </td>
                        <td>
                            {isEditing && formData.id === compte.id ? (
                                <input type="checkbox" name="est_admin" checked={formData.est_admin}
                                       onChange={handleChange}/>
                            ) : (
                                compte.est_admin ? 'Oui' : 'Non'
                            )}
                        </td>
                        <td>
                            {isEditing && formData.id === compte.id ? (
                                <>
                                    <button onClick={() => updateCompte(compte.id)}>
                                        <img src={"/static/check.png"} alt="Button Valider"/>
                                    </button>
                                    <button onClick={() => setIsEditing(false)}>
                                        <img src={"/static/cross.png"} alt="Button Annuler"/>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => editCompte(compte)}>
                                        <img src={"/static/edit.png"} alt="Button Modifier"/>
                                    </button>
                                    <button onClick={() => deleteCompte(compte.id)}>
                                        <img src={"/static/cross.png"} alt="Button Supprimer"/>
                                    </button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Compte;