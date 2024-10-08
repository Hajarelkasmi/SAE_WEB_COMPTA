import React from "react";

function register() {
    return (
        <div>
            <img></img>
            <div>
                <h1>Bienvenue !</h1>
                <h2>Inscription</h2>
                <p>Inscrivez-vous pour accéder à tous nos cours et à une multitude d'exercices</p>
                <form>
                    <div class="register-form">
                        <label for="email">Adresse mail</label>
                        <input type="email" name="email" id="email" required />
                    </div>
                    <div class="register-form">
                        <label for="classe">Votre classe</label>
                        <input type="text" name="classe" id="classe" required />
                    </div>
                    <div class="register-form">
                        <label for="password">Mot de passe</label>
                        <input type="password" name="password" id="password" required />
                    </div>
                    <input type="submit" value="Demander l'accès" />
                </form>
                <p>Vous receverez un mail lorsque l'administrateur aura accepté votre demande.</p>
            </div>
        </div>

        // <div className="App">
        //   <header className="App-header">
        //     <img src={logo} className="App-logo" alt="logo" />
        //     <p>
        //       Edit <code>src/App.js</code> and save to reload.
        //     </p>
        //     <a
        //       className="App-link"
        //       href="https://reactjs.org"
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       Learn React
        //     </a>
        //   </header>
        // </div>
    );
}

export default register;
