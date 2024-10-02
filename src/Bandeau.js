import './Bandeau.css';
import ElemBandeau from './ElemBandeau';

function Bandeau() {
  return (
    <header>
        <nav>
            <img src="logo192.png" alt="logo" id='logo' />
            <ul>
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
        </nav>
    </header>
  );
}

export default Bandeau;