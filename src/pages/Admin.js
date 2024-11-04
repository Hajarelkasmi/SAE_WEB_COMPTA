import Demande from "./Demande";
import Compte from "./Compte";
import '../css/Admin.css';
import Container_Admin_Stat from "./Container_Admin_Stat";
import React, { useEffect } from 'react';

function Admin() {
    const demande = Demande();
    const compte = Compte();
    const container_admin_stat = Container_Admin_Stat();

    // au chargement de la page, changer la couleur du texte de l'entête et du pied de page et leurs enfants
    useEffect(() => {
        let header = document.querySelector("header");
        let footer = document.querySelector("footer");
        header.style.backgroundColor = "#f44336";
        footer.style.backgroundColor = "#f44336";
        header.querySelectorAll("*").forEach(child => {
            child.style.backgroundColor = "#f44336";
        });
        footer.querySelectorAll("*").forEach(child => {
            child.style.backgroundColor = "#f44336";
        });
    });
    return (
        <div className="admin">
            <h1>Administration</h1>
            {demande}
            {compte}
            {container_admin_stat}
        </div>
    );
}

export default Admin;