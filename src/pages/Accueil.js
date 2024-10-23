import "../styles/Accueil.css";
import SectionTitre from "../composants/SectionTitre";
import PresentationAccueil from "../composants/PresentationAccueil";
import Carrousel from "../composants/Carrousel";

function Accueil() {
    return (
        <main>
            <SectionTitre />
            <PresentationAccueil />
            <Carrousel />
        </main>
    );
}

export default Accueil;