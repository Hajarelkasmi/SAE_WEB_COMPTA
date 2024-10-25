import "../styles_composants/Footer.css";

function Footer() {
  return (
    <footer>
        <div>
            <div>
                <a href="/" alt="home"><img src="/logo_bitmoji.png" alt="logo" className="logo" id="footer_logo_bitmoji" /></a>
                <a href="https://www.youtube.com" alt="youtube" target="_blank" rel="noreferrer"><img src="/logo_youtube.png" alt="logo" className="logo" /></a>
                <a href="https://www.facebook.com" alt="facebook" target="_blank" rel="noreferrer"><img src="/logo_facebook.png" alt="logo" className="logo" /></a>
                <a href="https://www.instagram.com" alt="instagram" target="_blank" rel="noreferrer"><img src="/logo_instagram.png" alt="logo" className="logo" /></a>
                <a href="https://www.gmail.com" alt="gmail" target="_blank" rel="noreferrer"><img src="/logo_mail.png" alt="logo" className="logo" /></a>
            </div>
            <p>
                <span>@Site réalisé par : </span><a href="https://www.github.com" target="_blank" rel="noreferrer">Brizard Amélie</a>, <a href="https://www.github.com" target="_blank" rel="noreferrer">El Kasmi Hajar</a>, <a href="https://www.github.com" target="_blank" rel="noreferrer">Haudebourg Baptiste</a>, <a href="https://www.github.com" target="_blank" rel="noreferrer">Merit Juliann</a>, <a href="https://www.github.com" target="_blank" rel="noreferrer">Rousselet Juliette</a>
            </p>
            <p id="footer_github_logo">Voir notre travail : <a href="https://www.github.com/" target="_blank" rel="noreferrer"><img src="/github_logo.png" alt="github" className="logo" /></a></p>
        </div>
        <div id="footer_links">
            <p>
                <a href="https://www.github.com" target="_blank" rel="noreferrer">Accessibilité</a>
                <a href="https://www.github.com" target="_blank" rel="noreferrer">Nous contacter</a>
                <a href="https://www.github.com" target="_blank" rel="noreferrer">Légal</a>
                <a href="https://www.github.com" target="_blank" rel="noreferrer">Protection des données</a>
                <a href="https://www.github.com" target="_blank" rel="noreferrer">Sécurité et confidentialité</a>
            </p>
        </div>
    </footer>
  );
}

export default Footer;