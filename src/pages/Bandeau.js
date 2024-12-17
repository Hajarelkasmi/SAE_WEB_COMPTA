import '../css/Bandeau.css';
import ElemBandeau from './ElemBandeau';
import ElemReseau from './ElemReseau';
import {useEffect, useState} from 'react';
import {checkAdmin} from "./CheckAdmin";

function Bandeau() {
    const [data, setData] = useState([]);
    const [isAdmin, setIsAdmin] = useState(null);
    const [auths, setAuths] = useState([]);

    useEffect(() => {
        const fetchAdminStatus = async () => {
            try {
                const adminStatus = await checkAdmin();
                setIsAdmin(adminStatus);
            } catch (error) {
                console.error('Erreur:', error);
            }
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

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setAuths([
                {img: '/deconnexion.png', link: '/deconnexion'},
                {img: '/compte.png', link: '/compte'}
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

        if(!menuToggle){
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
        console.log(sousMenus);
        sousMenus.forEach(sousMenu => {
            sousMenu.style.backgroundColor = isAdmin ? '#a63629' : '#1c3f59';
        });
        const header = document.querySelector('header');
        if(header) {
            header.style.backgroundColor = isAdmin ? '#a63629' : '#1c3f59';
        }
        console.log(isAdmin);
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
                    {/* <ElemBandeau link="/accueil" nom="Accueil" enfants={[]} /> */}
                    {data.map((elem) => (
                        <ElemBandeau key={elem.id} link={"/categories/" + elem.id} nom={elem.nom}
                                     enfants={elem.enfants}/>
                    ))}
                    {isAdmin ? <ElemBandeau link="/admin" nom="Admin" enfants={[ {nom: 'Catégories', link: '/admin/categories'}]} isAdmin={isAdmin} /> : ''}
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