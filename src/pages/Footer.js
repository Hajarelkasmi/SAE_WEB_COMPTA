import "../css/Footer.css";

function Footer() {
  return (
    <footer>
        <div id="nos_contacts">
            <div>
                <a href="/" alt="home"><img src="/logo_bitmoji.png" alt="logo" className="logo" id="footer_logo_bitmoji" /></a>
                <a href="https://www.youtube.com" alt="youtube" target="_blank" rel="noreferrer"><img src="/logo_youtube.png" alt="logo" className="logo" /></a>
                <a href="https://www.facebook.com" alt="facebook" target="_blank" rel="noreferrer"><img src="/logo_facebook.png" alt="logo" className="logo" /></a>
                <a href="https://www.instagram.com" alt="instagram" target="_blank" rel="noreferrer"><img src="/logo_instagram.png" alt="logo" className="logo" /></a>
                <a href="https://www.gmail.com" alt="gmail" target="_blank" rel="noreferrer"><img src="/logo_mail.png" alt="logo" className="logo" /></a>
                <a href="https://www.linkedin.com" alt="gmail" target="_blank" rel="noreferrer"><img src="/logo_linkedin.png" alt="logo" className="logo" /></a>
            </div>
            <p>
                <span>@Site réalisé par : </span><a href="https://github.com/amelie-brizard" target="_blank" rel="noreferrer">Brizard Amélie</a>, <a href="https://github.com/Hajarelkasmi" target="_blank" rel="noreferrer">El Kasmi Hajar</a>, <a href="https://github.com/bap-haudebourg" target="_blank" rel="noreferrer">Haudebourg Baptiste</a>, <a href="https://github.com/JuliannMerit" target="_blank" rel="noreferrer">Merit Juliann</a>, <a href="https://github.com/Juliette0070" target="_blank" rel="noreferrer">Rousselet Juliette</a>
            </p>
            <p id="footer_github_logo">Voir notre travail : <a href="https://github.com/Hajarelkasmi/SAE_WEB_COMPTA" target="_blank" rel="noreferrer"><img src="/github_logo.png" alt="github" className="logo" /></a></p>
        </div>
        <div id="footer_links">
            <p>
                <a href="/accessibilite" rel="noreferrer">Accessibilité</a>
                <a href="/contact" rel="noreferrer">Nous contacter</a>
                <a href="/legal" rel="noreferrer">Légal</a>
                <a href="/protection_donnees" rel="noreferrer">Protection des données</a>
                <a href="/securite_confidentialite" rel="noreferrer">Sécurité et confidentialité</a>
            </p>
        </div>
    </footer>
  );
}

export default Footer;