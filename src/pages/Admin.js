import React, { useState, useEffect } from 'react';
import Demande from "./Demande";
import Compte from "./Compte";
import '../css/Admin.css';
import Container_Admin_Stat from "./Container_Admin_Stat";
import {refresh} from "./RefreshToken";


const Admin = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAdmin = async () => {
            const token = localStorage.getItem('token');
            if (token === null) {
                setIsAdmin(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/isAdmin', {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API response:', errorText);
                    throw new Error('Error verifying token');
                }

                const data = await response.json();
                setIsAdmin(data.isAdmin);
            } catch (error) {
                console.error('Error verifying token:', error);
                setError(error);
            }
        };
        if (localStorage.getItem('token')) {
            refresh();
        }
        checkAdmin();
    }, []);

    if (error) {
        return (
            <div className="admin-container">
                <h1>Administration</h1>
                <p>Il y a eu une erreur lors de la vérification de votre accès. Veuillez réessayer plus tard.</p>
            </div>
        );
    }

    if (isAdmin === null) {
        return (
            <div className="admin-container">
                <h1>Administration</h1>
                <p>Chargement...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="admin-container">
                <h1>Administration</h1>
                <p>Vous n'êtes pas autorisé à accéder à cette page.</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <h1>Administration</h1>
            <Demande />
            <Compte />
            <Container_Admin_Stat />
        </div>
    );
};

export default Admin;