import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Bandeau from './pages/Bandeau';
import Footer from './pages/Footer';
import Accueil from './pages/Accueil';
import Register from './pages/Register';
import Login from './pages/Login';
import Main_Page from './pages/Main_Page';
import Create_Page from './pages/Create_Page';
import Admin from "./pages/Admin";
import Categorie from "./pages/Categorie";
import Disconnect from "./pages/Disconnect";
import InactivityTimer from "./InactivityTimer";
import Create_Categorie from "./pages/Create_Categorie";
import Gestion_Categorie from "./pages/Gestion_Categorie";
import { InfosProvider } from "./InfosContext";
import Profil from "./pages/Profil";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


function App() {
    let reseaux = [
        {img: "/youtube_logo.png", link: "https://youtube.com"},
        {img: "/tiktok_logo.png", link: "https://tiktok.com"},
    ];
    return (
        <div className="App">
            <InfosProvider>
                <InactivityTimer/>
                <Bandeau reseaux={reseaux}/>
                <div className="spacer">
                    <BrowserRouter>
                        <Routes>
                            {/* Routes pour l'accueil */}
                            <Route path="/" element={<Accueil/>}/>
                            <Route path="/accueil" element={<Accueil/>}/>
                            {/* Routes pour l'authentification */}
                            <Route exact path='/inscription' element={<Register/>}></Route>
                            <Route exact path='/connexion' element={<Login/>}></Route>
                            <Route exact path='/deconnexion' element={<Disconnect/>}></Route>
                            {/* Routes pour les pages */}
                            <Route exact path='/admin' element={<Admin/>}></Route>
                            <Route exact path='/admin/categories' element={<Gestion_Categorie/>}></Route>
                            <Route exact path='/page/:id' element={<Main_Page/>}></Route>
                            <Route exact path='/categories/create' element={<Create_Categorie/>}></Route>
                            <Route exact path='/categories/:id_categorie/edit' element={<Create_Categorie/>}></Route>
                            <Route exact path='/categories/:id_parent/create' element={<Create_Categorie/>}></Route>
                            <Route exact path='/categories/:id_categorie' element={<Categorie/>}></Route>
                            <Route exact path='/categories/:id_categorie/pages/:id_page' element={<Create_Page/>}></Route>
                            <Route exact path='/categories/:id_categorie/pages' element={<Create_Page/>}></Route>
                            <Route exact path='/profil' element={<Profil/>}></Route>
                        </Routes>
                        <ToastContainer />
                    </BrowserRouter>
                </div>
                <Footer/>
            </InfosProvider>
        </div>
    );
}

export default App;
