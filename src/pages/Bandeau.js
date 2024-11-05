import '../css/Bandeau.css';
import ElemBandeau from './ElemBandeau';
import ElemAuth from './ElemAuth';
import { useEffect, useState } from 'react';

function Bandeau() {
    let auths = [
        {img: "https://static.vecteezy.com/system/resources/previews/021/919/677/non_2x/login-icon-in-trendy-flat-style-isolated-on-white-background-approach-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-flat-style-for-graphic-design-vector.jpg", link: "/connexion"},
        {img: "https://static.thenounproject.com/png/736545-200.png", link: "/inscription"},
        {img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTemYz0V3xvKXKcdZrVdg_oU4IohHY7nfFn9Q&s", link: "/deconnexion"},
        {img: "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg", link: "/compte"},
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
                console.log(data);
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
        if (header.classList.contains('menu-open')) {
            menuToggle.innerHTML = '✖';
        } else {
            menuToggle.innerHTML = '☰';
        }
    });
  };
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
                <ElemBandeau link="/blog" nom="Blog" enfants={[]} />
                { localStorage.getItem('token') ? <ElemBandeau link="/deconnexion" nom="Déconnexion" enfants={[]} /> : <ElemBandeau link="/connexion" nom="Connexion" enfants={[]} />

                }
            </ul>
            <ul id="auths">
              {auths.map((elem, index) => (
                    <ElemAuth key={index} img={elem.img} link={elem.link} />
                ))}
            </ul>
        </nav>
    </header>
  );
}

export default Bandeau;