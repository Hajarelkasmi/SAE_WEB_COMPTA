import './Bandeau.css';
import ElemBandeau from './ElemBandeau';

function Bandeau() {
  return (
    <header>
        <nav>
            <a href='/' id="logohome"><img src="logo_bitmoji.png" alt="logo" class='logo' /></a>
            {/* <select id="menu" name="menu" size="1">
                <option value="accueil">Accueil</option>
                <option value="contact">Contact</option>
                <option value="comptabilité">Comptabilité</option>
                <option value="contrôle de gestion">Contrôle de gestion</option>
                <option value="gestion financière">Gestion financière</option>
                <option value="fiscalité financière">Fiscalité financière</option>
                <option value="communication">Communication</option>
                <option value="pédagogie">Pédagogie</option>
                <option value="blog">Blog</option>
            </select> */} {/* essais de menu déroulant */}
            <ul id="pages">
                <ElemBandeau link="/" text="Accueil" />
                <ElemBandeau link="/contact" text="Contact" />
                <ElemBandeau link="/" text="Comptabilité" />
                <ElemBandeau link="/" text="Contrôle de gestion" />
                <ElemBandeau link="/" text="Gestion financière" />
                <ElemBandeau link="/" text="Fiscalité financière" />
                <ElemBandeau link="/" text="Communication" />
                <ElemBandeau link="/" text="Pédagogie" />
                <ElemBandeau link="/" text="Blog" />
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