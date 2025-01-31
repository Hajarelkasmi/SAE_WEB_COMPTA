import React, {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import '../css/Gestion_Categorie.css';
import {InfosContext} from "../InfosContext";

const Gestion_Categorie = () => {
    const [categories, setCategories] = useState([]);
    const {IP_api} = useContext(InfosContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(IP_api + '/api/bandeau', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la récupération du menu');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Erreur:', error);
            }
        }

        fetchData();
    }, []);


    return (
        <div className="gestion_categorie">
            <h1>Gestion des catégories</h1>
            <div className="categories">
                <h2>Catégories</h2>
                <ul>
                    {categories.map((categorie, index) => (
                        <li key={index}>
                            <a href={`/categories/${categorie.id}`}>{categorie.nom}</a>
                            <input type='button' onClick={() => navigate(`/categories/${categorie.id}`)} value='Modifier' />
                            <input type='button' value='Supprimer' />
                            <ul className="categorie">
                                {categorie.enfants.map((enfant, index) => (
                                    <li key={index}>
                                        <a href={`/categories/${enfant.id}`}>{enfant.nom}</a>
                                        <input type='button' onClick={() => navigate(`/categories/${enfant.id}`)} value='Modifier' />
                                        <input type='button' value='Supprimer' />
                                    </li>
                                ))}
                            </ul>
                                
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
        ;
}

export default Gestion_Categorie;