import {useContext, useEffect, useState} from 'react';
import {InfosContext} from "../InfosContext";

const refresh = async () => {
    const {IP_api} = useContext(InfosContext);
    const response = await fetch(IP_api + '/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            token: localStorage.getItem('refreshToken')
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse de l\'API:', errorText);
        throw new Error('Erreur lors de la récupération du menu');
    }
    const data = await response.json();
    try {
        localStorage.setItem('token', data.token);
    } catch (error) {
        document.cookie = `token=${data.token}; path=/`;
    }
};

export { refresh };