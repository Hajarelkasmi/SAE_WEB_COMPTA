import logo from './logo.svg';
import './App.css';
import Bandeau from './Bandeau';

function App() {
  let elemsMenu = [
    {link: "/accueil", text: "Accueil"},
    {link: "/compta", text: "Comptabilité", enfants: [
      {link: "/compta/partie1", text: "Partie 1", enfants: [
        {link: "/compta/partie1/chapitre1", text: "Chapitre 1"},
        {link: "/compta/partie1/chapitre2", text: "Chapitre 2", enfants: [
          {link: "/compta/partie1/chapitre2/section1", text: "Section 1"},
          {link: "/compta/partie1/chapitre2/section2", text: "Section 2"},
        ]},
        {link: "/compta/partie1/chapitre3", text: "Chapitre 3"},
      ]},
      {link: "/compta/partie2", text: "Partie 2"},
      {link: "/compta/partie3", text: "Partie 3"},
    ]},
    {link: "/controle_de_gestion", text: "Contrôle de gestion", enfants: [
      {link: "/gestion/partie1", text: "Partie 1"},
      {link: "/gestion/partie2", text: "Partie 2"},
      {link: "/gestion/partie3", text: "Partie 3"},
    ]},
    {link: "/gestion_financiere", text: "Gestion financière", enfants: [
      {link: "/gestion_financiere/partie1", text: "Partie 1"},
      {link: "/gestion_financiere/partie2", text: "Partie 2"},
      {link: "/gestion_financiere/partie3", text: "Partie 3"},
    ]},
    {link: "/fiscalite_financiere", text: "Fiscalité financière"},
    {link: "/communication", text: "Communication"},
    {link: "/pedagogie", text: "Pédagogie", enfants: [
      {link: "/pedagogie/partie1", text: "Partie 1"},
      {link: "/pedagogie/partie2", text: "Partie 2"},
      {link: "/pedagogie/partie3", text: "Partie 3"},
    ]},
    {link: "/blog", text: "Blog"},
  ];
  let reseaux = [
    {img: "/logo192.png", link: "/logo"},
    {img: "/logo192.png", link: "/logo"},
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
