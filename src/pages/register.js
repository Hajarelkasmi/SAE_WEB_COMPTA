import React from "react";
import '../css/register.css'
import logo from '../img/logo.png'

function register() {
    return (
        <div id="register">
            <img src={logo} alt="logo of the website" id="register-logo" />
            <div id="register-main-block">
                <h1 id="h1-register">Bienvenue !</h1>
                <h2 id="h2-register">Inscription</h2>
                <p>Inscrivez-vous pour accéder à tous nos cours et à une multitude d'exercices.</p>
                <form id="form-register">
                    <div class="name-block">
                        <input class="input-register" type="text" name="nom" id="nom" placeholder="Nom" required />
                        <input class="input-register" type="text" name="prenom" id="prenom" placeholder="Prénom" required />
                    </div>
                    <input class="input-register" type="email" name="email" id="email" placeholder="Adresse mail" required />
                    {/* <input class="input-register" type="text" name="classe" id="classe" placeholder="Votre classe" required /> */}
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
                </form>
                <p>Vous receverez un mail lorsque l'administrateur aura accepté votre demande.</p>
            </div>
        </div>
    );
}

export default register;
