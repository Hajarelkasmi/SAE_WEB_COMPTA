import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Bandeau from './pages/Bandeau';
import Footer from './pages/Footer';
import Accueil from './pages/Accueil';
import Register from './pages/Register';
import Main_Page from './pages/Main_Page';
import Create_Page from './pages/Create_Page';

function App() {
  let reseaux = [
    {img: "/youtube_logo.png", link: "https://youtube.com"},
    {img: "/tiktok_logo.png", link: "https://tiktok.com"},
  ];
  return (
    <div className="App">
      <Bandeau reseaux={reseaux} />
      <div className="spacer">
      <BrowserRouter>
        <Routes>
          {/* Routes pour l'accueil */}
          <Route path="/" element={<Accueil />} />
          <Route path="/accueil" element={<Accueil />} />
          {/* Routes pour l'authentification */}
          <Route exact path='/inscription' element={<Register />}></Route>
          <Route exact path='/page/:id' element={<Main_Page />}></Route>
          <Route exact path='/categories/:id_categorie/pages/:id_page' element={<Create_Page />}></Route>
        </Routes>
      </BrowserRouter>
      </div>
      <Footer />
    </div>
  );
}

export default App;
