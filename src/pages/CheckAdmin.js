const checkAdmin = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    try {
        const response = await fetch('http://localhost:5000/api/isAdmin', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });

        if (!response.ok) {
            console.error('API response:', await response.text());
            return false;
        }

        const data = await response.json();
        return data.isAdmin === true;
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
};

export { checkAdmin };