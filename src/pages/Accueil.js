import "../css/Accueil.css";
import SectionTitre from "./SectionTitre";
import PresentationAccueil from "./PresentationAccueil";
import Carrousel from "./Carrousel";

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