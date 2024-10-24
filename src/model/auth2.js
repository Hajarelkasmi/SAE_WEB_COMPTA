import axios from 'axios';

const API_URL = '/api/authenticate'; // Assurez-vous que l'URL correspond à votre configuration Express

export const authenticateUser = async (credentials) => {
    try {
        const response = await axios.post(API_URL, credentials);
        return response.data; // Renvoie les données de réponse
    } catch (error) {
        throw error; // Gérez l'erreur selon vos besoins
    }
};
