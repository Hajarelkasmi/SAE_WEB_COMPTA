import './Bandeau.css';
import ElemBandeau from './ElemBandeau';

function Bandeau() {
  return (
    <header>
        <nav>
            <a href='/' id="logohome"><img src="logo_bitmoji.png" alt="logo" class='logo' /></a>
            <ul id="pages">
                <ElemBandeau link="/" text="Accueil" />
                <ElemBandeau link="/" text="Comptabilité" enfants={[{link:"/", text:"lien 1"}, {link:"/", text:"lien 2"}, {link:"/", text:"lien 3"}]} />
                <ElemBandeau link="/" text="Contrôle de gestion" enfants={[{link:"/", text:"lien a"}, {link:"/", text:"lien b"}, {link:"/", text:"lien c"}]} />
                <ElemBandeau link="/" text="Gestion financière" enfants={[{link:"/", text:"lien i"}, {link:"/", text:"lien ii"}, {link:"/", text:"lien iii"}]} />
                <ElemBandeau link="/" text="Fiscalité financière" />
                <ElemBandeau link="/" text="Communication" />
                <ElemBandeau link="/" text="Pédagogie" enfants={[{link:"/", text:"lien I"}, {link:"/", text:"lien II"}, {link:"/", text:"lien III"}]} />
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