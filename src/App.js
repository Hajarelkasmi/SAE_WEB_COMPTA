import logo from './logo.svg';
import './App.css';
import Bandeau from './Bandeau';

function App() {
  let elems = [
    {link: "/", text: "Accueil"},
    {link: "/", text: "Comptabilité", enfants: [
      {link: "/", text: "lien 1"},
      {link: "/", text: "lien 2"},
      {link: "/", text: "lien 3"},
    ]},
    {link: "/", text: "Contrôle de gestion", enfants: [
      {link: "/", text: "lien a"},
      {link: "/", text: "lien b"},
      {link: "/", text: "lien c"},
    ]},
    {link: "/", text: "Gestion financière", enfants: [
      {link: "/", text: "lien i"},
      {link: "/", text: "lien ii"},
      {link: "/", text: "lien iii"},
    ]},
    {link: "/", text: "Fiscalité financière"},
    {link: "/", text: "Communication"},
    {link: "/", text: "Pédagogie", enfants: [
      {link: "/", text: "lien I"},
      {link: "/", text: "lien II"},
      {link: "/", text: "lien III"},
    ]},
    {link: "/", text: "Blog"},
  ];
  return (
    <div className="App">
      <Bandeau elems={elems} />
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
    </div>
  );
}

export default App;
