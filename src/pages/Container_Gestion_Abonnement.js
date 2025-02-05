import {useContext, useEffect, useState} from "react";
import {InfosContext} from "../InfosContext";
import popup from "./Popup";

const Container_Gestion_Abonnement = (abonne) => {

    const {idUser} = useContext(InfosContext);
    const [isAbonne, setIsAbonne] = useState(false);

    useEffect(() => {
        setIsAbonne(abonne.abonne);
        try {
            if (!abonne.abonne) {
                fetch(`http://localhost:5000/api/demande_abonnements/${idUser}`, {
                    headers: {'Authorization': localStorage.getItem('token')}
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data) {
                            setIsAbonne(-1);
                        }
                    })
                    .catch(error => {
                        console.error('Erreur:', error);
                    });
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    }, [idUser, abonne.abonne]);

    const handleAbonnement = () => {
        try {
            fetch(`http://localhost:5000/api/demande_abonnements/`, {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                }
            })
                .then(response => {
                    if (!response.ok) {
                        const errorText = response.text();
                        console.error('Réponse de l\'API:', errorText);
                        throw new Error('Erreur lors de la demande d\'abonnement');
                    }
                    setIsAbonne(-1);
                    popup('Demande d\'abonnement envoyée', 2000, 'success');
                })
                .catch(error => {
                    console.error('Erreur lors de la demande d\'abonnement:', error);
                });
        } catch (error) {
            console.error('Erreur lors de la demande d\'abonnement:', error);
        }
    }

    const handleDesabonnement = () => {
        try {
            fetch(`http://localhost:5000/api/desabonnement/${idUser}`, {
                method: 'PUT',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                }
            })
                .then(response => {
                    if (!response.ok) {
                        const errorText = response.text();
                        console.error('Réponse de l\'API:', errorText);
                        throw new Error('Erreur lors de la suppression de l\'abonnement');
                    }
                    setIsAbonne(false);
                    popup('Désabonnement effectué', 2000, 'success');
                })
                .catch(error => {
                    console.error('Erreur lors de la suppression de l\'abonnement:', error);
                });
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'abonnement:', error);
        }
    }

    return (
        <div>
            Status de l'abonnement :
            {isAbonne === true && ' Abonné'}
            {isAbonne === false && ' Non abonné'}
            {isAbonne === -1 && ' En attente de validation'}
            {isAbonne === true && <button onClick={handleDesabonnement}>Se désabonner</button>}
            {!isAbonne && <button onClick={handleAbonnement}>S'abonner</button>}
            {isAbonne === -1 && <p>Votre demande d'abonnement est en attente de validation.</p>}
        </div>
    );
}

export default Container_Gestion_Abonnement;