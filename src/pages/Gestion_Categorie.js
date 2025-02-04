import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import '../css/Gestion_Categorie.css';
import Popup from "./Popup";

const Gestion_Categorie = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/bandeau', {
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

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                }
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de la catégorie');
            }
            console.log(response);
            Popup(response.text(),2000, 'success');
        } catch (error) {
            console.error('Erreur:', error);
        }
    }


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
                            <input type='button' value='Supprimer' onClick={() => handleDelete(categorie.id)} />
                            <ul className="categorie">
                                {categorie.enfants.map((enfant, index) => (
                                    <li key={index}>
                                        <a href={`/categories/${enfant.id}`}>{enfant.nom}</a>
                                        <input type='button' onClick={() => navigate(`/categories/${enfant.id}`)} value='Modifier' />
                                        <input type='button' value='Supprimer' onClick={() =>  handleDelete(enfant.id)} />
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