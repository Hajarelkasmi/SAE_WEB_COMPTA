import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Disconnect = () => {
    const Navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        Navigate('/');
        window.location.reload();
    }, [Navigate]);

    return null;
}

export default Disconnect;