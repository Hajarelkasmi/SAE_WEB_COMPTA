import React, {useState} from 'react';
import '../css/Login.css';
import {useNavigate} from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const Navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mail: email,
                    mot_de_passe: password
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la connexion');
            }

            const data = await response.json();

            // Stockez le token dans localStorage ou state
            localStorage.setItem('token', data.token);
            // Redirigez l'utilisateur ou effectuez d'autres actions après la connexion
            Navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Une erreur est survenue');
            console.error('Erreur lors de la connexion:', err);
        }
    };

    return (
        <div className="login-container">
            <img src={"/static/logo.png"} alt="logo of the website" id="login-logo"/>
            <h1>BIENVENUE !</h1>
            <form onSubmit={handleLogin} id="login-form">
                <h2>CONNEXION</h2>
                <p>Identifiez-vous pour accéder à tous nos cours et à une multitude d'exercices !</p>
                <label htmlFor="email" id="login-label">Adresse e-mail</label>


                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />


                <label htmlFor="password" id="login-label">Mot de passe</label>


                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />


                <button type="submit">CONTINUER</button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
            <p>Vous n'êtes pas inscrit ? <a href="/register">Inscription</a></p>
        </div>
    );
};

export default Login;
