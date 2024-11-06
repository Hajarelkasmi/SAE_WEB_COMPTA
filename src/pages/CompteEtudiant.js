import React, { useState, useEffect } from 'react';
import '../css/CompteEtudiant.css';

function CompteEtudiant() {
    const [compte, setCompte] = useState({
        nom: '',
        prenom: '',
        mail: '',
        mot_de_passe: '',
        classe_id: '',
        classe: '',
        est_abonne: false,
        est_admin: false
    });

    async function fetchCompte() {
        const response_etu = await fetch('http://localhost:5000/api/etudiants/1');
        const data = await response_etu.json();
        const response_classe = await fetch(`http://localhost:5000/api/classes/${data.classe_id}`);
        const data_classe = await response_classe.json();
        setCompte(data);
        setCompte(compte => ({...compte, classe: data_classe.nom}));
    }

    useEffect(() => {
        fetchCompte().catch(console.error);
    }, []);

    return (
        <div id='compte_etudiant'>
            <h1>Compte de l'étudiant</h1>
            <p><span>Nom:</span> {compte.nom}</p>
            <p><span>Prénom:</span> {compte.prenom}</p>
            <p><span>Email:</span> {compte.mail}</p>
            <p><span>Password:</span> {compte.mot_de_passe}</p>
            <p><span>Classe:</span> {compte.classe}</p>
            <p><span>Abonné:</span> {compte.est_abonne ? 'Oui' : 'Non'}</p>
            <p><span>Admin:</span> {compte.est_admin ? 'Oui' : 'Non'}</p>
        </div>
    );
}

export default CompteEtudiant;