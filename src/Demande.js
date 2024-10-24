import {useState, useEffect} from "react";
import './Demande.css';

function Demande() {
    const [demandes, setDemandes] = useState([]);

    async function fetchDemandes() {
        try {
            let response = await fetch('http://localhost:5000/api/demande_abonnements');
            let data = await response.json();
            setDemandes(data);
        } catch (error) {
            console.error('Error fetching demandes:', error);
        }
    }

    useEffect(() => {
        fetchDemandes().catch(r => console.error("Erreur", r));
    }, []);

    async function accepterDemande(id) {
        await fetch(`http://localhost:5000/api/etudiants/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                est_abonne: 1
            })

        }).catch(r => console.error("Erreur", r));

        await fetch(`http://localhost:5000/api/demande_abonnements/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(r => console.error("Erreur", r));

        fetchDemandes().catch(r => console.error("Erreur", r));
    }

    async function refuserDemande(id) {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir refuser cette demande ?");
        if (!confirmed) {
            return;
        }

        await fetch(`http://localhost:5000/api/demande_abonnements/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(r => console.error("Erreur", r));

        fetchDemandes().catch(r => console.error("Erreur", r));
    }


    return (
        <div>
            <h2>Gestion des abonnements</h2>
            <table>
                <thead>
                <tr>
                    <th>Nom Prénom</th>
                    <th>Mail</th>
                    <th>Classe</th>
                    <th>Décision</th>
                </tr>
                </thead>
                <tbody>
                {demandes.map((demande) => (
                    <tr>
                        <td>{demande.Etudiant.nom} {demande.Etudiant.prenom}</td>
                        <td>{demande.Etudiant.mail}</td>
                        <td>{demande.Etudiant.Classe.nom}</td>
                        <td>
                            <button onClick={() => accepterDemande(demande.Etudiant.id)}>
                                <img src={"/static/check.png"} alt="Button Accepter"/>
                            </button>
                            <button onClick={() => refuserDemande(demande.Etudiant.id)}>
                                <img src={"/static/cross.png"} alt="Button Refuser"/>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Demande;