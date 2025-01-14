import "../css/Accueil.css";
import Carrousel from "./Carrousel";
import Main_Page from "./Main_Page";

function Accueil() {
    return (
        <main>
            <Main_Page id_page={1} />
            <Carrousel />
        </main>
    );
}

export default Accueil;