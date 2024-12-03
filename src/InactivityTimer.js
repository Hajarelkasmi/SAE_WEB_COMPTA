import { useEffect } from 'react';

const InactivityTimer = ({ timeout = 300000 }) => { // Default timeout is 5 minutes (300000 ms)

    const logout = () => {
        window.location.href = '/deconnexion';
    };

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            return;
        }

        let timer;
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(logout, timeout);
        };

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);

        resetTimer(); // Initialize the timer

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
        };
    }, [timeout]);

    return null;
};

export default InactivityTimer;