import './Bandeau.css';
import ElemBandeau from './ElemBandeau';

function Bandeau({elems}) {
  return (
    <header>
        <nav>
            <a href='/' id="logohome"><img src="logo_bitmoji.png" alt="logo" class='logo' /></a>
            <ul id="pages">
                {elems.map((elem, index) => (
                    <ElemBandeau key={index} link={elem.link} text={elem.text} enfants={elem.enfants} />
                ))}
            </ul>
            <ul id="reseaux">
              <li><a href='/'><img src="logo192.png" alt="logo" class='logo' /></a></li>
              <li><a href='/'><img src="logo192.png" alt="logo" class='logo' /></a></li>
            </ul>
        </nav>
    </header>
  );
}

export default Bandeau;