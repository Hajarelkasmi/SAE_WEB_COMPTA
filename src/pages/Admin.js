import React, {useState, useEffect} from 'react';
import Demande from "./Demande";
import Compte from "./Compte";
import '../css/Admin.css';
import Container_Admin_Stat from "./Container_Admin_Stat";
import {refresh} from "./RefreshToken";
import {checkAdmin} from "./CheckAdmin";


const Admin = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    useEffect(() => {
        const fetchAdminStatus = async () => {
            const adminStatus = await checkAdmin();
            setIsAdmin(adminStatus);
        };

        fetchAdminStatus();

        if (localStorage.getItem('token')) {
            refresh();
        }
    }, []);

    if (isAdmin === null) {
        return (
            <div className="admin-container">
                <h1>Administration</h1>
                <p>Chargement...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="admin-container">
                <h1>Administration</h1>
                <p>Vous n'êtes pas autorisé à accéder à cette page.</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <h1>Administration</h1>
            <Demande/>
            <Compte/>
            <Container_Admin_Stat/>
        </div>
    );
};

export default Admin;