import React, { useState } from 'react';
import './login.css';
import logo from '../img/logo.png';
import { authenticate } from '../model/auth2.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Logique pour gérer la connexion
    console.log('Login:', { email, password });
  };

  return (
    <div className="login-container">
   <img src={logo} alt="logo of the website" id="login-logo" />
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
      </form>
      <p>Vous n'êtes pas inscrit ? <a href="/register">Inscription</a></p>
    </div>
  );
};

export default Login;
