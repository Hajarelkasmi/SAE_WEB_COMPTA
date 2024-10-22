import "../styles/Accueil.css";
import SectionTitre from "../composants/SectionTitre";

function Accueil() {
    return (
        <main>
            <SectionTitre />
            <section id="presentation">
                <img src="/logo_bitmoji.png" alt="Accueil" />
                <div id="texte">
                    <h2>La Comptabilité financière pour tous !</h2>
                    <div id="paragraphes">
                        <p>Enseignante en gestion comptable et financière 📈​ depuis plus de 20 ans, je vous propose de vous partager mes cours.</p>
                        <p>Je vous partage mes conseils pour que vous deveniez des étudiants aguerris.</p>
                        <p>Ce site est encore en construction, alors vous pouvez retrouver dès maintenant toutes mes vidéos de cours de gestion comptable et financière sur Youtube.</p>
                        {/* <p>Bonjour 👋​ et bienvenue sur mon site internet.</p>
                        <p>👩‍🏫​ Enseignante  en gestion comptable et financière 📈​ depuis plus de 20 ans, je vous propose de vous partager mes cours.</p>
                        <p>Parce que vous avez été absent, vous avez eu du mal à comprendre un cours, vous souhaitez approfondir une notion ou vous exercez en vue de vos futurs examens, je vous partage mes cours sous format de vidéos ou de fiches.</p>
                        <p>De plus, vous avez peut-être des difficultés à apprendre, à rester motiver, à communiquer en respectant les codes des études supérieures, alors je vous partage mes conseils pour que vous deveniez des étudiants aguerris.</p>
                        <p>Ce site est encore en construction 🛠️​, alors pour retrouver dès maintenant toutes mes vidéos de cours de gestion comptable et financière, vous pouvez les retrouver  directement sur ma chaine Youtube ▶️​.</p> */}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Accueil;