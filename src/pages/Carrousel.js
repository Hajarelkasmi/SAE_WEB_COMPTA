import SectionTitre from "../composants/SectionTitre";
import "../styles/Carrousel.css";
import ElemCarrousel from "../composants/ElemCarrousel";
import React, { useState } from 'react';

function Carrousel() {
  let elemsCarrousel = [
    {src: "/Cours 1", img: "/logo_bitmoji.png", nom: "COMPTABILITÉ APPROFONDIE"},
    {src: "/Cours 2", img: "/logo_bitmoji.png", nom: "COMMUNICATION"},
    {src: "/Cours 3", img: "/logo_bitmoji.png", nom: "COMPTABILITÉ FINANCIÈRE"},
    {src: "/Cours 4", img: "/logo_bitmoji.png", nom: "CONTRÔLE DE GESTION"},
    {src: "/Cours 5", img: "/logo_bitmoji.png", nom: "GESTION FINANCIERE"},
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleItemsCount = 4;

  const totalItems = elemsCarrousel.length;

  // Fonction pour passer à l'élément suivant
  const handleNext = () => {
    if (currentIndex + visibleItemsCount < totalItems) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Retour au début
    }
  };

  // Fonction pour passer à l'élément précédent
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(totalItems - 1); // Aller à la fin
    }
  };
  
  return (
    <main>
        <SectionTitre />
        <section id="cours">
            <h2>Cours de Gestion de Comptabilité et Finance</h2>
            <div id="carrousel">
                {/* <a href="#cours" id="precedent">P</a> */}
                {/* {elemsCarrousel.map((elem, index) => (
                    <ElemCarrousel key={index} src={elem.src} img={elem.img} nom={elem.nom} />
                ))} */}
                {/* <a href="#cours" id="suivant">S</a> */}
                <button id="precedent" onClick={handlePrevious}><img src="https://cdn.icon-icons.com/icons2/1863/PNG/512/keyboard-arrow-left_119012.png" alt="fleche gauche" /></button>
                {elemsCarrousel
                  .slice(currentIndex, currentIndex + visibleItemsCount)
                  .map((elem, index) => (
                    <ElemCarrousel key={index} src={elem.src} img={elem.img} nom={elem.nom} />
                  ))}
                <button id="suivant" onClick={handleNext}><img src="https://cdn.icon-icons.com/icons2/1863/PNG/512/keyboard-arrow-left_119012.png" alt="fleche droite" /></button>
            </div>
        </section>
    </main>
  );
}

export default Carrousel;