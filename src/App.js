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
import Logout from './pages/Logout';
import Erreur from './pages/Erreur';
import CompteEtudiant from './pages/CompteEtudiant';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    {/* Routes pour l'authentification */}
                    <Route exact path='/inscription' element={<Register/>}></Route>
                    <Route exact path='/connexion' element={<Login/>}></Route>
                    <Route exact path='/deconnexion' element={<Logout/>}></Route>

                    {/* Routes avec bandeau et footer */}
                    <Route path="*" element={
                        <>
                            <Bandeau/>
                            <div className="spacer">
                                <Routes>
                                    {/* Routes pour l'accueil */}
                                    <Route path="/" element={<Accueil/>}/>
                                    <Route path="/accueil" element={<Accueil/>}/>

                                    {/* Routes pour l'admin */}
                                    <Route path="/admin" element={<Admin/>}/>

                                    {/* Routes pour le compte de l'étudiant */}
                                    <Route path="/compte" element={<CompteEtudiant/>}/>

                                    {/* Routes pour les éléments du menu */}
                                    <Route path="/page/:id" element={<Main_Page/>}/>
                                    <Route path="/categories/:id_categorie" element={<Categorie/>}/>
                                    <Route path="/categories/:id_categorie/pages/:id_page" element={<Create_Page/>}/>
                                    <Route path="/categories/:id_categorie/pages" element={<Create_Page/>}/>

                                    {/* Route par défaut */}
                                    <Route path="*" element={<Erreur numero={404} message="La page demandée n'a pas été trouvée"/>}/>
                                </Routes>
                            </div>
                            <Footer/>
                        </>
                    }/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
