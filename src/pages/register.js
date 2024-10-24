import React, { useEffect, useState } from "react";
import '../css/register.css'
import logo from '../img/logo.png'

function Register() {

    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [mail, setEmail] = useState('');
    const [classe, setClasse] = useState('');
    const [mot_de_passe, setPassword] = useState('');
    const [demandeAbonnement, setDemandeAbonnement] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
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
        };

        fetchClasses();
    }, []);

    const handleRegister = async (event) => {
        event.preventDefault();

        const formData = {
            nom: nom,
            prenom: prenom,
            mail: mail,
            classe_id: parseInt(classe),
            mot_de_passe: mot_de_passe,
            est_abonne: false,
            est_admin: false
        };

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const newEtudiant = await response.json();
                if (demandeAbonnement) {
                    try {
                        const demandeResponse = await fetch('http://localhost:5000/api/demande_abonnements', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `${newEtudiant.token}`
                            },
                            body: JSON.stringify({ etudiant_id: newEtudiant.id })
                        });

                        if (demandeResponse.ok) {
                            console.log('Demande d\'abonnement envoyée avec succès !');
                        } else {
                            console.error('Erreur dans l\'envoi d\'une demande d\'abonnement:', await demandeResponse.json());
                            setErrorMessage('Erreur dans l\'envoi d\'une demande d\'abonnement');
                        }
                    } catch (error) {
                        console.error('Erreur dans l\'envoi d\'une demande d\'abonnement:', error);
                        setErrorMessage('Erreur dans l\'envoi d\'une demande d\'abonnement');
                    }
                }
                console.log('Inscription réussite !');
                setSuccessMessage('Inscription réussie !');
                setErrorMessage('');
            } else {
                const errorData = await response.json();
                console.error('Registration error:', errorData);
                setErrorMessage('Une erreur est survenue lors de l\'inscription.');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Network error:', error);
            setErrorMessage('Une erreur est survenue. Veuillez réessayer plus tard.');
            setSuccessMessage('');
        }
    };

    return (
        <div id="register">
            <img src={logo} alt="logo of the website" id="register-logo" />
            <div id="register-main-block">
                <h1 id="h1-register">Bienvenue !</h1>
                <h2 id="h2-register">Inscription</h2>
                <p>Inscrivez-vous pour accéder à tous nos cours et à une multitude d'exercices.</p>
                <form id="form-register" onSubmit={handleRegister}>
                    <div class="name-block">
                        <input class="input-register" type="text" name="nom" id="nom" placeholder="Nom" onChange={(e) => setNom(e.target.value)} required />
                        <input class="input-register" type="text" name="prenom" id="prenom" placeholder="Prénom" onChange={(e) => setPrenom(e.target.value)} required />
                    </div>
                    <input class="input-register" type="email" name="mail" id="email" placeholder="Adresse mail" onChange={(e) => setEmail(e.target.value)} required />
                    <select class="input-register" name="classe" id="classe" value={classe} onChange={(e) => setClasse(e.target.value)} required>
                        <option value="">CLASSE</option>
                        {classes.map(classe => (
                            <option key={classe.id} value={classe.id}>{classe.nom}</option>
                        ))}
                    </select>
                    <input class="input-register" type="password" name="mot_de_passe" id="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required />
                    <div id="checkbox-register">
                        <input class="input-register" type="checkbox" name="est_abonne" id="access" checked={demandeAbonnement} onChange={(e) => setDemandeAbonnement(e.target.checked)} />
                        <label htmlFor="access">Demander l'accès/s'abonner.</label>
                    </div>
                    <input id="register-button" type="submit" value="S'inscrire" />
                </form>
                {successMessage && <div className="success-message">{successMessage}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <p>Vous receverez un mail lorsque l'administrateur aura accepté votre demande.</p>
            </div>
        </div>
    );
}

export default Register;
