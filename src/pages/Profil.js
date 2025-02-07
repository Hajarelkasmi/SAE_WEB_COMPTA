import {useContext, useEffect, useState} from "react";
import {InfosContext} from "../InfosContext";
import Container_MDP from "./Container_MDP";
import Popup from "./Popup";
import "../css/Profil.css";
import Container_Gestion_Abonnement from "./Container_Gestion_Abonnement";

const Profil = () => {
    const {idUser} = useContext(InfosContext);
    const [userData, setUserData] = useState({});
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [mail, setMail] = useState('');
    const [classeId, setClasseId] = useState('');
    const [isAbonne, setIsAbonne] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        if (!idUser) {
            return;
        }
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/etudiants/${idUser}`, {
                    headers: {'Authorization': localStorage.getItem('token')}
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la récupération des informations');
                }
                const data = await response.json();
                setUserData(data);
                setNom(data.nom);
                setPrenom(data.prenom);
                setMail(data.mail);
                setIsAbonne(data.est_abonne);
                setClasseId(data.classe_id);
            } catch (error) {
                console.error('Erreur:', error);
            }
        }

        const fetchClasses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/classes');
                if (response.ok) {
                    const data = await response.json();
                    setClasses(data);
                } else {
                    console.error('Error fetching classes:', response.status);
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        }
        fetchUserData();
        fetchClasses();
    }, [idUser]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === 'nom') setNom(value);
        if (name === 'prenom') setPrenom(value);
        if (name === 'mail') setMail(value);
        if (name === 'classe_id') setClasseId(value);
    };

    const handleUpdate = async () => {
        try {
            const updatedData = {
                nom,
                prenom,
                mail,
                classe_id: classeId
            };
            const response = await fetch(`http://localhost:5000/api/etudiants/${idUser}`, {
                method: 'PUT',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour des informations');
            }
            const data = await response.json();
            setUserData(data);
            setIsEditing(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
        Popup('Informations mises à jour', 1500, 'success');
        setTimeout(() => {
            window.location.reload();
        },1800);
    };

    if (!idUser) {
        return (
            <div>
                <h1>Profil</h1>
                <p>Vous devez être connecté pour accéder à cette page</p>
            </div>
        );
    }

    return (
        <div className="div-profil">
            <h1 className="h1-profil">Profil</h1>
            {isEditing ? (
                <div className="div-prof">
                    <label className="label-profil">
                        Nom:
                        <input type="text" name="nom" value={nom} onChange={handleChange} />
                    </label>
                    <label className="label-profil">
                        Prénom:
                        <input type="text" name="prenom" value={prenom} onChange={handleChange} />
                    </label>
                    <label className="label-profil">
                        Mail:
                        <input type="text" name="mail" value={mail} onChange={handleChange} />
                    </label>
                    <label className="label-profil">
                        Classe:
                        <select name="classe_id" value={classeId} onChange={handleChange}>
                            {classes.map(classe => (
                                <option key={classe.id} value={classe.id}>{classe.nom}</option>
                            ))}
                        </select>
                    </label>
                    <button onClick={handleUpdate}>Valider</button>
                    <button onClick={() => setIsEditing(false)}>Annuler</button>
                </div>
            ) : (
                <div className="profil-container">
                    <p>Nom: {userData.nom}</p>
                    <p>Prénom: {userData.prenom}</p>
                    <p>Mail: {userData.mail}</p>
                    <p>Classe: {userData.classe}</p>
                    <button onClick={() => setIsEditing(true)}>Modifier</button>
                </div>
            )}
            <Container_MDP/>
            <Container_Gestion_Abonnement abonne={isAbonne}/>
        </div>
    );
}

export default Profil;