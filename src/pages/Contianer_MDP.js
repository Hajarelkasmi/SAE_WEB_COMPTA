import React, { useState } from 'react';

const Contianer_MDP = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

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
        // Handle form submission logic here
        console.log(formData);
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

export default Contianer_MDP;