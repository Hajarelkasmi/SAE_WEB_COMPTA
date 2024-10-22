import React, { useState } from "react";
import '../css/register.css'
import logo from '../img/logo.png'

// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser'); // Middleware to parse JSON

// app.use(bodyParser.json());

// app.post('/api/register', (req, res) => {
//     const formData = req.body; 
//     console.log('Received registration data:', formData);

//     // ... your logic to save the user data to your database (e.g., using Sequelize)

//     // Send a response
//     if (/* registration successful */) {
//         res.status(201).json({ message: 'User registered successfully' });
//     } else {
//         res.status(500).json({ message: 'Registration failed' });
//     }
// });


function Register() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        classe: '',
        password: '',
        access: false
    });

    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        try {
            const response = await fetch('/api/demande_abonnements', { // Adjust the endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Handle successful registration (e.g., redirect, display message)
                console.log('Registration successful!');
                // You might want to redirect to a login page or display a success message
            } else {
                const errorData = await response.json();
                console.error('Registration error:', errorData);
                // Handle registration errors (e.g., display error messages to the user)
            }
        } catch (error) {
            console.error('Network error:', error);
            // Handle network or other unexpected errors
        }
    }

    return (
        <div id="register">
            <img src={logo} alt="logo of the website" id="register-logo" />
            <div id="register-main-block">
                <h1 id="h1-register">Bienvenue !</h1>
                <h2 id="h2-register">Inscription</h2>
                <p>Inscrivez-vous pour accéder à tous nos cours et à une multitude d'exercices.</p>
                {/* <form id="form-register">
                    <div class="name-block">
                        <input class="input-register" type="text" name="nom" id="nom" placeholder="Nom" required />
                        <input class="input-register" type="text" name="prenom" id="prenom" placeholder="Prénom" required />
                    </div>
                    <input class="input-register" type="email" name="email" id="email" placeholder="Adresse mail" required />
                    <select class="input-register" name="classe" id="classe">
                        <option id="select-default-value" value="">CLASSE</option>
                        <option value="1">Classe 1</option>
                        <option value="2">Classe 2</option>
                        <option value="3">Classe 3</option>
                    </select>
                    <input class="input-register" type="password" name="password" id="password" placeholder="Mot de passe" required />
                    <div id="checkbox-register">
                        <input class="input-register" type="checkbox" name="access" id="access" />
                        <label for="access">Demander l'accès/s'abonner.</label>
                    </div>
                    <input id="register-button" type="submit" value="S'inscrire" />
                </form> */}
                <form id="form-register" onSubmit={handleSubmit}>
                    <div className="name-block">
                        <input className="input-register" type="text" name="nom" id="nom" placeholder="Nom" required value={formData.nom} onChange={handleChange} />
                        <input className="input-register" type="text" name="prenom" id="prenom" placeholder="Prénom" required value={formData.prenom} onChange={handleChange} />
                    </div>
                    <input className="input-register" type="email" name="email" id="email" placeholder="Adresse mail" required value={formData.email} onChange={handleChange} />
                    <select className="input-register" name="classe" id="classe" value={formData.classe} onChange={handleChange}>
                        <option id="select-default-value" value="">CLASSE</option>
                        <option value="1">Classe 1</option>
                        <option value="2">Classe 2</option>
                        <option value="3">Classe 3</option>
                    </select>
                    <input className="input-register" type="password" name="password" id="password" placeholder="Mot de passe" required value={formData.password} onChange={handleChange} />
                    <div id="checkbox-register">
                        <input className="input-register" type="checkbox" name="access" id="access" checked={formData.access} onChange={handleChange} />
                        <label htmlFor="access">Demander l'accès/s'abonner.</label>
                    </div>
                    <input id="register-button" type="submit" value="S'inscrire" />
                </form>
                <p>Vous receverez un mail lorsque l'administrateur aura accepté votre demande.</p>
            </div>
        </div>
    );
}

export default Register;
