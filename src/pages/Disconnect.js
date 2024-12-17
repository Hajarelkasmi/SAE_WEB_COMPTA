import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Popup from "./Popup";

const Disconnect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/');
        Popup('Vous avez été déconnecté', 3000, 'success');
        // window.location.reload();
    }, [navigate]);

    return null;
}

export default Disconnect;