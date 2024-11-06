const refresh = async () => {
    const response = await fetch('http://localhost:5000/api/token', {
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