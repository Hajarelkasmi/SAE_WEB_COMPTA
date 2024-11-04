import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Bandeau from './pages/Bandeau';
import Footer from './pages/Footer';
import Accueil from './pages/Accueil';
import Register from './pages/Register';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  let elemsMenu = [
    {link: "/accueil", nom: "Accueil"},
    {link: "/compta", nom: "Comptabilité", enfants: [
      {link: "/compta/partie1", nom: "Partie 1"},
      {link: "/compta/partie2", nom: "Partie 2"},
      {link: "/compta/partie3", nom: "Partie 3"},
    ]},
    {link: "/controle_de_gestion", nom: "Contrôle de gestion", enfants: [
      {link: "/gestion/partie1", nom: "Partie 1"},
      {link: "/gestion/partie2", nom: "Partie 2"},
      {link: "/gestion/partie3", nom: "Partie 3"},
    ]},
    {link: "/gestion_financiere", nom: "Gestion financière", enfants: [
      {link: "/gestion_financiere/partie1", nom: "Partie 1"},
      {link: "/gestion_financiere/partie2", nom: "Partie 2"},
      {link: "/gestion_financiere/partie3", nom: "Partie 3"},
    ]},
    {link: "/fiscalite_financiere", nom: "Fiscalité financière"},
    {link: "/communication", nom: "Communication"},
    {link: "/pedagogie", nom: "Pédagogie", enfants: [
      {link: "/pedagogie/partie1", nom: "Partie 1"},
      {link: "/pedagogie/partie2", nom: "Partie 2"},
      {link: "/pedagogie/partie3", nom: "Partie 3"},
      {link: "/pedagogie/partie4", nom: "Partie 4"},
    ]},
    {link: "/blog", nom: "Blog"},
  ];
  let reseaux = [
    {img: "/youtube_logo.png", link: "https://youtube.com"},
    {img: "/tiktok_logo.png", link: "https://tiktok.com"},
  ];
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Routes pour l'authentification */}
          <Route path="/inscription" element={<Register />} />
          <Route path="/connexion" element={<Login />} />
  
          {/* Routes avec bandeau et footer */}
          <Route
            path="*"
            element={
              <>
                <Bandeau elemsMenu={elemsMenu} reseaux={reseaux} />
                <div className="spacer">
                  <Routes>
                    {/* Routes pour l'accueil */}
                    <Route path="/" element={<Accueil />} />
                    <Route path="/accueil" element={<Accueil />} />

                    {/* Routes pour l'admin */}
                    <Route path="/admin" element={<Admin />} />

                    {/* Routes pour les éléments du menu */}
                    {elemsMenu.map((elem, index) => (
                      <React.Fragment key={index}>
                        {/* Route pour l'élément principal */}
                        <Route path={elem.link} element={
                          <main>
                            <h1>{elem.nom}</h1>
                          </main>
                        } />
                        {/* Routes pour les sous-elements du menu, si présents */}
                        {elem.enfants && elem.enfants.map((enfant, enfantIndex) => (
                          <Route key={`${index}-${enfantIndex}`} path={enfant.link} element={
                            <main>
                              <h1>{elem.nom} : {enfant.nom}</h1>
                            </main>
                          } />
                        ))}
                      </React.Fragment>
                    ))}
                  </Routes>
                </div>
                <Footer />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );  
}

export default App;
