import '../css/Bandeau.css';
import ElemBandeau from './ElemBandeau';
import ElemReseau from './ElemReseau';
import {useContext, useEffect, useState} from 'react';
import {InfosContext} from "../InfosContext";

function Bandeau() {
    const [data, setData] = useState([]);
    const {isAdmin, IP_api} = useContext(InfosContext);
    const [auths, setAuths] = useState([]);
    const currentPath = window.location.pathname;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch( IP_api + '/api/bandeau',
                    {
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
                setData(data);
            }
            catch (error) {
                console.error('Erreur:', error);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        if (localStorage.getItem('token')) {
            setAuths([
                {img: '/deconnexion.png', link: '/deconnexion'},
                {img: '/compte.png', link: '/profil'}
            ]);
        } else {
            setAuths([
                {img: '/connexion.png', link: '/connexion'},
                {img: '/inscription.png', link: '/inscription'}
            ]);
        }
    }, []);

    window.onload = function () {
        const menuToggle = document.querySelector('.menu-toggle');
        const header = document.querySelector('header');

        if (!menuToggle || !header) {
            return;
        }

        menuToggle.addEventListener('click', function () {
            header.classList.toggle('menu-open');
            if (header.classList.contains('menu-open')) {
                menuToggle.innerHTML = '✖';
            } else {
                menuToggle.innerHTML = '☰';
            }
        });
    };

    useEffect(() => {
        const sousMenus = document.querySelectorAll('.sous');
        sousMenus.forEach(sousMenu => {
            sousMenu.style.backgroundColor = isAdmin ? '#a63629' : '#1c3f59';
        });
        const header = document.querySelector('header');
        if(header) {
            header.style.backgroundColor = isAdmin ? '#a63629' : '#1c3f59';
        }
    }, [isAdmin, data]);

    if (isAdmin === null) {
        return <div>Loading...</div>;
    }

    return (
        <header>
            <button className='menu-toggle'>☰</button>
            <nav>
                <a href='/' id="logohome"><img src="/logo_bitmoji.png" alt="logo" className='logo'/></a>
                <ul id="pages">
                    {data.map((elem) => (
                        <ElemBandeau
                            key={elem.id}
                            link={"/categories/" + elem.id}
                            nom={elem.nom}
                            enfants={elem.enfants}
                            className={currentPath.includes(`/categories/${elem.id}`) ? 'active' : ''}
                        />
                    ))}
                    {/*{isAdmin ? <ElemBandeau link="/admin" nom="Admin" enfants={[ {nom: 'Catégories', link: '/admin/categories'}]} isAdmin={isAdmin} /> : ''}*/}
                    {isAdmin ? <ElemBandeau link="/admin" nom="Admin" isAdmin={isAdmin} /> : ''}
                </ul>
                <ul id="auths">
                    {auths.map((elem) => (
                        <ElemReseau key={elem.id} img={elem.img} link={elem.link}/>
                    ))}
                </ul>
            </nav>
        </header>
    );
}

export default Bandeau;