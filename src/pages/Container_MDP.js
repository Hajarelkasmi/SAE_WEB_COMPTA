import React, {useContext, useState} from 'react';
import {InfosContext} from "../InfosContext";
import Popup from "./Popup";
import {useNavigate} from "react-router-dom";

const Container_MDP = () => {
    const {idUser, IP_api} = useContext(InfosContext);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage('Les mots de passe ne correspondent pas.');
            return;
        }

        try{
            const response = await fetch(IP_api + '/api/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: idUser,
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse de l\'API:', errorText);
                throw new Error('Erreur lors de la modification du mot de passe');
            }
            setErrorMessage('');
            Popup('Mot de passe modifié', 2000, 'success');
            Popup('Vous allez être déconnecté', 2000, 'error');
            setTimeout(() => {
                navigate("/deconnexion");
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error('Erreur lors de la modification du mot de passe:', error);
            setErrorMessage('Erreur lors de la modification du mot de passe');
        }

        // Handle form submission logic here
        setShowForm(false);
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
    };

    const verifyPassword = () => {
        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage('Les mots de passe ne correspondent pas.');
        } else {
            setErrorMessage('');
        }
    };

    return (
        <div>
            <button className='change_mdp' onClick={() => setShowForm(!showForm)}>
                Changer de mot de passe
            </button>
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Mot de passe actuel</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Nouveau mot de passe</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Confirmation du mot de passe</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={verifyPassword}
                            required
                        />
                    </div>
                    <button type="submit">Valider</button>
                </form>
            )}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
}

export default Container_MDP;