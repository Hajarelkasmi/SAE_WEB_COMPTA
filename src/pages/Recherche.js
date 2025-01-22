import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../css/Recherche.css';

const Recherche = () => {
    const location = useLocation();
    const search = new URLSearchParams(location.search).get('query');
    const [searchTerm, setSearchTerm] = useState(search);
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pages, setPages] = useState([]);
    const [rubriques, setRubriques] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/recherche`);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la récupération des informations');
                }
                const data = await response.json();
                setData(data);
                handleFilterCategories(data.categories);
                handleFilterPages(data.pages);
                handleFilterRubriques(data.rubriques);
                console.log(data.rubriques);
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
        fetchData();
    }, [search]);

    if (!data.length === 0) {
        return <div>Chargement...</div>;
    }

    const handleFilterCategories = (categories) => {
        setCategories(categories.filter(categorie => categorie.nom.toLowerCase().includes(searchTerm.toLowerCase())));
    }

    const handleFilterPages = (pages) => {
        setPages(pages.filter(page => page.nom.toLowerCase().includes(searchTerm.toLowerCase())));
    }

    const handleFilterRubriques = (rubriques) => {
        setRubriques(rubriques.filter(rubrique => rubrique.nom.toLowerCase().includes(searchTerm.toLowerCase())));
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleFilterCategories(data.categories);
            handleFilterPages(data.pages);
            handleFilterRubriques(data.rubriques);
            window.history.pushState({}, '', `/search?query=${searchTerm}`);
        }
    };

    return (  
        <div className="recherche">
            <h1>Résultats de la recherche</h1>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Rechercher..."
                onBlur={() => { handleFilterCategories(data.categories); handleFilterPages(data.pages); handleFilterRubriques(data.rubriques); window.history.pushState({}, '', `/search?query=${searchTerm}`); } }
            />
            {categories.map(categorie => (
                <a key={categorie.id} href={`/categorie/${categorie.id}`}>
                    <img src={`/static/image/${categorie.image}`} alt={categorie.nom} />
                    {categorie.nom}
                </a>
            ))}
            {pages.map(page => (
                <a key={page.id} href={`/page/${page.id}`}>
                    <img src={`/static/image/${page.image}`} alt={page.nom} />
                    {page.nom.replace(/<[^>]*>/g, '')}
                </a>
            ))}
            {rubriques.map(rubrique => (
                <a key={rubrique.id} href={`/page/${rubrique.page_id}`}>
                    {rubrique.nom}
                </a>
            ))}
        </div>
    );
}

export default Recherche;