import React from "react";
import './register.css'

function register() {
    return (
        <div>
            <img></img>
            <div class="register-main-block">
                <h1>Bienvenue !</h1>
                <h2>Inscription</h2>
                <p>Inscrivez-vous pour accéder à tous nos cours et à une multitude d'exercices</p>
                <form>
                    <div class="name-block">
                        <div class="register-form">
                            {/* <label for="nom">Nom</label> */}
                            <input type="text" name="nom" id="nom" placeholder="Nom" required />
                        </div>
                        <div class="register-form">
                            {/* <label for="prenom">Prénom</label> */}
                            <input type="text" name="prenom" id="prenom" placeholder="Prénom" required />
                        </div>
                    </div>
                    <div class="register-form">
                        {/* <label for="email">Adresse mail</label> */}
                        <input type="email" name="email" id="email" placeholder="Adresse mail" required />
                    </div>
                    <div class="register-form">
                        {/* <label for="classe">Votre classe</label> */}
                        <input type="text" name="classe" id="classe" placeholder="Votre classe" required />
                    </div>
                    <div class="register-form">
                        {/* <label for="password">Mot de passe</label> */}
                        <input type="password" name="password" id="password" placeholder="Mot de passe" required />
                    </div>
                    <div>
                        <input type="checkbox" name="access" id="access" />
                        <label for="access">Demander l'accès/s'abonner.</label>
                    </div>
                    <input type="submit" value="S'inscrire" />
                </form>
                <p>Vous receverez un mail lorsque l'administrateur aura accepté votre demande.</p>
            </div>
        </div>
    );
}

export default register;

// nom prénom à rajouter
// case à cocher "demander l'accès"