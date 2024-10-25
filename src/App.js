import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link, Router } from 'react-router-dom';
import Register from "./pages/register";
import Home from './pages/home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home />}></Route>
        <Route exact path='/inscription' element={<Register />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
