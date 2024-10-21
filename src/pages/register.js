import React from "react";
import '../css/register.css'
import logo from '../img/logo.png'

function register() {
    return (
        <div>
            <img src={logo} alt="logo of the website" id="register-logo" />
            <div class="register-main-block">
                <h1>Bienvenue !</h1>
                <h2>Inscription</h2>
                <p>Inscrivez-vous pour accéder à tous nos cours et à une multitude d'exercices.</p>
                <form>
                    <div class="name-block">
                        <input type="text" name="nom" id="nom" placeholder="Nom" required />
                        <input type="text" name="prenom" id="prenom" placeholder="Prénom" required />
                    </div>
                    <input type="email" name="email" id="email" placeholder="Adresse mail" required />
                    <input type="text" name="classe" id="classe" placeholder="Votre classe" required />
                    <input type="password" name="password" id="password" placeholder="Mot de passe" required />
                    <div id="checkbox-register">
                        <input type="checkbox" name="access" id="access" />
                        <label for="access">Demander l'accès/s'abonner.</label>
                    </div>
                    <input id="register-button" type="submit" value="S'inscrire" />
                </form>
                <p>Vous receverez un mail lorsque l'administrateur aura accepté votre demande.</p>
            </div>
        </div>
    );
}

export default register;
