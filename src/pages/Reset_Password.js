import React, {useState} from 'react';
import '../css/Register.css';
import {useNavigate, useParams} from 'react-router-dom';
import Popup from './Popup';

const Reset_Password = () => {
    const { token_reset } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [errorMessage, setErrorMessage] = useState(false);
    const Navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/etudiants/change_password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    mot_de_passe: password,
                    token_reset: token_reset
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la réinitialisation du mot de passe');
            }

            Popup('Mot de passe réinitialisé', 2000, 'success');
            Navigate('/login');
        } catch (error) {
            console.error('Erreur:', error);
            setError('Erreur lors de la réinitialisation du mot de passe');
        }
    }

    const verifyPassword = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
         if (password !== confirmPassword) {
            setErrorMessage('Les mots de passe ne correspondent pas.');
        } else if (!passwordRegex.test(password)) {
            setErrorMessage('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
        } else {
            setErrorMessage('');
        }
    };

    return (
        <div id="register">
            <img src={"/static/logo.png"} alt="logo of the website" id="register-logo" />
            <div id="register-main-block">
                <h1 id="h1-register">Bienvenue !</h1>
                <form id="form-register" onSubmit={handleResetPassword}>
                    <input className="input-register" type="password" name="mot_de_passe" id="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required />
                    <input className="input-register" type="password" name="confirm_password" id="confirm_password" placeholder="Confirmer le mot de passe" onChange={(e) => setConfirmPassword(e.target.value)} onBlur={verifyPassword} required />
                    <input id="register-button" type="submit" value="Valider" />
                </form>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
        </div>
    );

}

export default Reset_Password;

    