import React, { useState } from "react";
import '../css/register.css'
import logo from '../img/logo.png'

function Register() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        mail: '',
        classe: '',
        mot_de_passe: '',
        est_abonne: false,
        est_admin: false
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : (name === 'classe' ? parseInt(value, 10) : value)
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const newEtudiant = await response.json();
                console.log('Inscription réussite !', newEtudiant);

                if (formData.est_abonne) {
                    try {
                        const demandeResponse = await fetch('http://localhost:5000/api/demande_abonnements', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ etudiant_id: newEtudiant.id })
                        });

                        if (demandeResponse.ok) {
                            console.log('Demande d\'abonnement envoyée avec succès !');
                        } else {
                            console.error('Erreur dans l\'envoi d\'une demande d\'abonnement:', await demandeResponse.json());
                        }
                    } catch (error) {
                        console.error('Erreur dans l\'envoi d\'une demande d\'abonnement:', error);
                    }
                }

                setFormData({ ...formData, successMessage: 'Inscription réussie !' });
            } else {
                const errorData = await response.json();
                console.error('Registration error:', errorData);
                setFormData({ ...formData, errorMessage: errorData.message });
            }
        } catch (error) {
            console.error('Network error:', error);
            setFormData({ ...formData, errorMessage: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
        }
    };

    return (
        <div id="register">
            <img src={logo} alt="logo of the website" id="register-logo" />
            <div id="register-main-block">
                <h1 id="h1-register">Bienvenue !</h1>
                <h2 id="h2-register">Inscription</h2>
                <p>Inscrivez-vous pour accéder à tous nos cours et à une multitude d'exercices.</p>
                <form id="form-register" onSubmit={handleSubmit}>
                    <div class="name-block">
                        <input class="input-register" type="text" name="nom" id="nom" placeholder="Nom" onChange={handleChange} required />
                        <input class="input-register" type="text" name="prenom" id="prenom" placeholder="Prénom" onChange={handleChange} required />
                    </div>
                    <input class="input-register" type="email" name="mail" id="email" placeholder="Adresse mail" onChange={handleChange} required />
                    <select class="input-register" name="classe" id="classe" value={formData.classe} onChange={handleChange} required>
                        <option value="">CLASSE</option>
                        <option value="1">Classe 1</option>
                        <option value="2">Classe 2</option>
                        <option value="3">Classe 3</option>
                    </select>
                    <input class="input-register" type="password" name="mot_de_passe" id="password" placeholder="Mot de passe" onChange={handleChange} required />
                    <div id="checkbox-register">
                        <input class="input-register" type="checkbox" name="est_abonne" id="access" checked={formData.est_abonne} onChange={handleChange} />
                        <label htmlFor="access">Demander l'accès/s'abonner.</label>
                    </div>
                    <input id="register-button" type="submit" value="S'inscrire" />
                </form>
                {formData.successMessage && <div className="success-message">{formData.successMessage}</div>}
                {formData.errorMessage && <div className="error-message">{formData.errorMessage}</div>}
                <p>Vous receverez un mail lorsque l'administrateur aura accepté votre demande.</p>
            </div>
        </div>
    );
}

export default Register;
