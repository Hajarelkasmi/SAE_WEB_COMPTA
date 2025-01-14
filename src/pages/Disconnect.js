import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Popup from "./Popup";

const Disconnect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        Navigate('/');
        Popup('Vous avez été déconnecté', 3000, 'success');
    }, [Navigate]);

    return null;
}

export default Disconnect;