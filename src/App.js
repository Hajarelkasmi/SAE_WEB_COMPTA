import logo from './logo.svg';
import './App.css';
import Bandeau from './Bandeau';

function App() {
  let elemsMenu = [
    {link: "/", text: "Accueil"},
    {link: "/", text: "Comptabilité", enfants: [
      {link: "/", text: "Partie 1"},
      {link: "/", text: "Partie 2"},
      {link: "/", text: "Partie 3"},
    ]},
    {link: "/", text: "Contrôle de gestion", enfants: [
      {link: "/", text: "Partie A"},
      {link: "/", text: "Partie B"},
      {link: "/", text: "Partie C"},
    ]},
    {link: "/", text: "Gestion financière", enfants: [
      {link: "/", text: "Partie i"},
      {link: "/", text: "Partie ii"},
      {link: "/", text: "Partie iii"},
    ]},
    {link: "/", text: "Fiscalité financière"},
    {link: "/", text: "Communication"},
    {link: "/", text: "Pédagogie", enfants: [
      {link: "/", text: "Partie I"},
      {link: "/", text: "Partie II"},
      {link: "/", text: "Partie III"},
    ]},
    {link: "/", text: "Blog"},
  ];
  let reseaux = [
    {img: "logo192.png", link: "/"},
    {img: "logo192.png", link: "/"},
  ];
  return (
    <div className="App">
      <Bandeau elemsMenu={elemsMenu} reseaux={reseaux} />
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
    </div>
  );
}

export default App;
