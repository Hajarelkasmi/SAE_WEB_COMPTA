import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

const Logout = () => {
    const Navigate = useNavigate();
    localStorage.removeItem('token');
    
    useEffect(() => {
        Navigate('/');
    }, [Navigate]);
    
};

export default Logout;
