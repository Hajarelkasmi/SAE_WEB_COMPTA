import logo from './logo.svg';
import './App.css';
import Bandeau from './Bandeau';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Accueil from './pages/Accueil';

function App() {
  let elemsMenu = [
    {link: "/accueil", nom: "Accueil"},
    {link: "/compta", nom: "Comptabilité", enfants: [
      {link: "/compta/partie1", nom: "Partie 1"
      },
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
      <Bandeau elemsMenu={elemsMenu} reseaux={reseaux} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
            </div>
          } />
          {/* Route pour l'accueil */}
          <Route path="/accueil" element={Accueil()} />
          {/* Routes pour les éléments du menu */}
          {elemsMenu.map((elem, index) => {
            return (
              <React.Fragment key={index}>
                {/* Route pour l'élément principal */}
                <Route path={elem.link} element={
                  <div className="App-header">
                    <h1>{elem.nom}</h1>
                  </div>
                } />
                {/* Routes pour les enfants, si présents */}
                {elem.enfants && elem.enfants.map((enfant, enfantIndex) => (
                  <Route key={`${index}-${enfantIndex}`} path={enfant.link} element={
                    <div className="App-header">
                      <h1>{elem.nom} : {enfant.nom}</h1>
                    </div>
                  } />
                ))}
              </React.Fragment>
            );
          })
        }
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
