import SectionTitre from "../composants/SectionTitre";
import "../styles/Carrousel.css";
import ElemCarrousel from "../composants/ElemCarrousel";

function Carrousel() {
  return (
    <main>
        <SectionTitre />
        <section id="cours">
            <h2>Cours de Gestion de Comptabilité et Finance</h2>
            <div id="carrousel">
                <a href="#cours" id="precedent">P</a>
                <ElemCarrousel src="/Cours 1" img="/logo_bitmoji.png" nom="Cours 1" />
                <ElemCarrousel src="/Cours 2" img="/logo_bitmoji.png" nom="Cours 2" />
                <ElemCarrousel src="/Cours 3" img="/logo_bitmoji.png" nom="Cours 3" />
                <ElemCarrousel src="/Cours 4" img="/logo_bitmoji.png" nom="Cours 4" />
                <ElemCarrousel src="/Cours 5" img="/logo_bitmoji.png" nom="Cours 5" />
                <a href="#cours" id="suivant">S</a>
            </div>
        </section>
    </main>
  );
}

export default Carrousel;