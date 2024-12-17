import {useEffect, useState} from "react";
import Popup from "./Popup";

function Compte() {
    const [comptes, setComptes] = useState([]);
    const [classes, setClasses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [filtres, setFiltres] = useState({classes: null, est_abonne: null});

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

    useEffect(() => {
        filtrerComptes().catch(r => console.error("Erreur", r));
    }, [filtres]);

    async function deleteCompte(id) {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ?");
        if (!confirmed) {
            return;
        }

        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/etudiants/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${token}`,
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
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/etudiants/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `${token}`,
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

    const filtrerComptes = async () => {
        let url = 'http://localhost:5000/api/etudiants';
        if (filtres.classes) {
            url += `?classe_id=${filtres.classes}`;
        }
        if (filtres.est_abonne) {
            url += `${filtres.classes ? '&' : '?'}est_abonne=1`;
        }
        console.log(url);
        const response = await fetch(url);
        const data = await response.json();
        setComptes(data);
    };

    const CopierMail = () => {
        navigator.clipboard.writeText(comptes.map(compte => compte.mail).join(', '));
        Popup("Mails copiés", 2000, "success");
    }

    return (
        <div className="table-container">
            <h2>Gestion des comptes</h2>
            <table>
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th><a href={`mailto:${comptes.map(compte => compte.mail).join(',')}`}>Mail</a><button onClick={CopierMail}>Copier</button></th>
                    <th>Mot de passe</th>
                    <th>
                        <label htmlFor="classe">Classe</label>
                        <select id="classe" multiple value={filtres.classes} onChange={e => {
                            const classes = filtres.classes ? [...filtres.classes] : [];
                            if (e.target.value === '') {
                                setFiltres({...filtres, classes: null});
                            } else {
                                if (classes.includes(e.target.value)) {
                                    classes.splice(classes.indexOf(e.target.value), 1);
                                } else {
                                    classes.push(e.target.value);
                                }
                                setFiltres({...filtres, classes});
                            }
                        }}>
                            <option value="" hidden>Choisir une classe</option>
                            {classes.map(classe => (
                                <option key={classe.id} value={classe.id} selected={filtres.classes && filtres.classes.includes(classe.id)}>{classe.nom}</option>
                            ))}
                        </select>
                        <button onClick={() => setFiltres({...filtres, classes: null})}><img src={"/static/cross.png"} alt="Bouton annuler"/></button>
                    </th>
                    <th>
                        <label htmlFor="est_abonne">Abonné</label>
                        <input type="checkbox" id="est_abonne" onChange={e => setFiltres({...filtres, est_abonne: e.target.checked})}/>
                    </th>
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
                                "********"
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