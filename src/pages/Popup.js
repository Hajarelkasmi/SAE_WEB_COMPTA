import { toast } from 'react-toastify';

function Popup( message, timer, type ) {
    if (type === "error") {
        toast.error(message, {
            position: "top-right",
            autoClose: timer,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    } else if (type === "success") {
        toast.success(message, {
            position: "top-right",
            autoClose: timer,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    } else {
        toast.info(message, {
            position: "top-right",
            autoClose: timer,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    }
    return null;
}

export default Popup;