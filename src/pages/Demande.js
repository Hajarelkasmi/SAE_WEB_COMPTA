import {useContext, useEffect, useState} from 'react';
import {InfosContext} from "../InfosContext";
import sendEmail from "./sendEmail";

function Demande() {
    const [demandes, setDemandes] = useState([]);
    const {IP_api} = useContext(InfosContext);

    async function fetchDemandes() {
        const token = localStorage.getItem('token');
        try {
            let response = await fetch(IP_api + '/api/demande_abonnements', {
                    headers: {
                        'Authorization': `${token}`
                    }
                });
            let data = await response.json();
            setDemandes(data);
        } catch (error) {
            console.error('Error fetching demandes:', error);
        }
    }

    useEffect(() => {
        fetchDemandes().catch(r => console.error("Erreur", r));
    }, []);

    async function accepterDemande(id, email) {
        const token = localStorage.getItem('token');
        await fetch(`IP_api + /api/etudiants/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                est_abonne: 1
            })

        }).catch(r => console.error("Erreur", r));

        await fetch(`IP_api + /api/demande_abonnements/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            }
        }).catch(r => console.error("Erreur", r));

        await sendEmail(email, 'Demande Acceptée', "Votre demande d'abonnement a été acceptée.");

        fetchDemandes().catch(r => console.error("Erreur", r));
    }

    async function refuserDemande(id, email) {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir refuser cette demande ?");
        if (!confirmed) {
            return;
        }

        const token = localStorage.getItem('token');
        await fetch(`IP_api + /api/demande_abonnements/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            }
        }).catch(r => console.error("Erreur", r));

        await sendEmail(email, 'Demande Refusée', "Votre demande d'abonnement a été refusée.");

        fetchDemandes().catch(r => console.error("Erreur", r));
    }


    return (
        <div className="table-container">
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
                            <button onClick={() => accepterDemande(demande.Etudiant.id, demande.Etudiant.mail)}>
                                <img src={"/static/check.png"} alt="Button Accepter"/>
                            </button>
                            <button onClick={() => refuserDemande(demande.Etudiant.id, demande.Etudiant.mail)}>
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