import logo from './logo.svg';
import './App.css';
import Bandeau from './Bandeau';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';

function App() {
  let elemsMenu = [
    {link: "/accueil", nom: "Accueil"},
    {link: "/compta", nom: "Comptabilité", enfants: [
      {link: "/compta/partie1", nom: "Partie 1"
      //   , enfants: [
      //   {link: "/compta/partie1/chapitre1", nom: "Chapitre 1"},
      //   {link: "/compta/partie1/chapitre2", nom: "Chapitre 2", enfants: [
      //     {link: "/compta/partie1/chapitre2/section1", nom: "Section 1"},
      //     {link: "/compta/partie1/chapitre2/section2", nom: "Section 2"},
      //   ]},
      //   {link: "/compta/partie1/chapitre3", nom: "Chapitre 3"},
      // ]
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
    ]},
    {link: "/blog", nom: "Blog"},
  ];
  let reseaux = [
    {img: "https://img.freepik.com/vecteurs-premium/logo-youtube-rouge-logo-medias-sociaux_197792-1803.jpg?w=360", link: "https://youtube.com"},
    {img: "data:image/png;base64,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", link: "https://facebook.com"},
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
