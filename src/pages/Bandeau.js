import '../css/Bandeau.css';
import ElemBandeau from './ElemBandeau';
import ElemAuth from './ElemAuth';
import { useEffect, useState } from 'react';

function Bandeau() {
    let auths = [
        {img: "/connexion.png", link: "/connexion"},
        {img: "/inscription.png", link: "/inscription"},
        {img: "/deconnexion.png", link: "/deconnexion"},
        {img: "/compte.png", link: "/compte"},
    ];

    const [data, setData] = useState([]);
    useEffect(() => {
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
            }
            catch (error) {
                console.error('Erreur:', error);
            }
        };
        fetchData();
    }, []);

    window.onload = function() {
        const menuToggle = document.querySelector('.menu-toggle');
        const header = document.querySelector('header');

        menuToggle.addEventListener('click', function() {
            header.classList.toggle('menu-open');
            menuToggle.innerHTML = header.classList.contains('menu-open') ? '✖' : '☰';
        });
    };

    const [authItems, setAuthItems] = useState([]); 
    useEffect(() => {
        let isConnected = !!localStorage.getItem('token');
        setAuthItems(isConnected ? auths.slice(2) : auths.slice(0, 2));
    }, []);

    return (
        <header>
            <button className='menu-toggle'>☰</button>
            <nav>
                <a href='/' id="logohome"><img src="/logo_bitmoji.png" alt="logo" className='logo' /></a>
                <ul id="pages">
                    <ElemBandeau link="/accueil" nom="Accueil" enfants={[]} />
                    {data.map((elem, index) => (
                        <ElemBandeau key={index} link={"/categories/" + elem.id} nom={elem.nom} enfants={elem.enfants} />
                    ))}
                </ul>
                <ul id="auths">
                    {authItems.map((elem, index) => (
                        <ElemAuth key={index} img={elem.img} link={elem.link} />
                    ))}
                </ul>
            </nav>
        </header>
    );
}

export default Bandeau;