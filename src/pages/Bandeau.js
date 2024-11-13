import '../css/Bandeau.css';
import ElemBandeau from './ElemBandeau';
import ElemReseau from './ElemReseau';
import { useEffect, useState } from 'react';
import { checkAdmin } from './CheckAdmin';

function Bandeau({ reseaux }) {
    const [data, setData] = useState([]);
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        const fetchAdminStatus = async () => {
            const adminStatus = await checkAdmin();
            setIsAdmin(adminStatus);
        };

        fetchAdminStatus();

        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/bandeau');
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la récupération du menu');
                }
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };
        fetchData();
    }, []);

    if (isAdmin === null) {
        return <div>Loading...</div>;
    }

    return (
        <header style={{ backgroundColor: isAdmin ? '#a63629' : '#1c3f59' }}>
            <button className='menu-toggle'>☰</button>
            <nav>
                <a href='/' id="logohome"><img src="/logo_bitmoji.png" alt="logo" className='logo' /></a>
                <ul id="pages">
                    <ElemBandeau link="/accueil" nom="Accueil" enfants={[]} isAdmin={isAdmin} />
                    {data.map((elem, index) => (
                        <ElemBandeau key={index} link={"/categories/" + elem.id} nom={elem.nom} enfants={elem.enfants} isAdmin={isAdmin} />
                    ))}
                    <ElemBandeau link="/blog" nom="Blog" enfants={[]} isAdmin={isAdmin} />
                    {localStorage.getItem('token') ? <ElemBandeau link="/deconnexion" nom="Déconnexion" enfants={[]} isAdmin={isAdmin} /> : <ElemBandeau link="/connexion" nom="Connexion" enfants={[]} isAdmin={isAdmin} />}
                </ul>
                <ul id="reseaux">
                    {reseaux.map((elem, index) => (
                        <ElemReseau key={index} img={elem.img} link={elem.link} />
                    ))}
                </ul>
            </nav>
        </header>
    );
}

export default Bandeau;