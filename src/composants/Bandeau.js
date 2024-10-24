import '../styles_composants/Bandeau.css';
import ElemBandeau from './ElemBandeau';
import ElemReseau from './ElemReseau';

function Bandeau({elemsMenu, reseaux}) {
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
                {elemsMenu.map((elem, index) => (
                    <ElemBandeau key={index} link={elem.link} nom={elem.nom} enfants={elem.enfants} />
                ))}
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