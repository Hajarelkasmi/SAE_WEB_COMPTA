const checkInfos = async () => {
    const token = localStorage.getItem('token');
    if (token === null) {
        return false;
    }

    try {
        const response = await fetch('http://localhost:5000/api/infos', {
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
        return await response.json();
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Error verifying token');
    }
};

export {checkInfos};