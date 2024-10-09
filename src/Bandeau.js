import './Bandeau.css';
import ElemBandeau from './ElemBandeau';
import ElemReseau from './ElemReseau';

function Bandeau({elemsMenu, reseaux}) {
  return (
    <header>
        <nav>
            <a href='/' id="logohome"><img src="logo_bitmoji.png" alt="logo" class='logo' /></a>
            <ul id="pages">
                {elemsMenu.map((elem, index) => (
                    <ElemBandeau key={index} link={elem.link} text={elem.text} enfants={elem.enfants} />
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