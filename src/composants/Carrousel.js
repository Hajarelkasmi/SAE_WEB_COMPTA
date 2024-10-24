import "../styles_composants/Carrousel.css";
import ElemCarrousel from "./ElemCarrousel";
import React, { useState, useEffect } from 'react';

function Carrousel() {
  let elemsCarrousel = [
    {src: "/Cours 1", img: "/logo_bitmoji.png", nom: "COMPTABILITÉ APPROFONDIE"},
    {src: "/Cours 2", img: "/youtube_logo.png", nom: "COMMUNICATION"},
    {src: "/Cours 3", img: "/tiktok_logo.png", nom: "COMPTABILITÉ FINANCIÈRE"},
    {src: "/Cours 4", img: "/logo192.png", nom: "CONTRÔLE DE GESTION"},
    {src: "/Cours 5", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS75ebrwvgVW5Ks_oLfCbG8Httf3_9g-Ynl_Q&s", nom: "GESTION FINANCIERE"},
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [depassement, setDepassement] = useState(0);
  const [visibleItemsCount, setVisibleItemsCount] = useState(4);

  const totalItems = elemsCarrousel.length;

  // Effect to handle resizing
  useEffect(() => {
    const updateVisibleItemsCount = () => {
      let visibleItemEstimate = (window.innerWidth - 480) / 288 + 1;
      if (visibleItemEstimate < 1) { // si visibleItemEstimate vaut 0 ou moins
        setVisibleItemsCount(1);
      } else if (visibleItemEstimate > 4) { // si visibleItemEstimate vaut plus de 4 (max d'elems voulus en même temps)
        setVisibleItemsCount(4);
      } else { // entre les deux
        setVisibleItemsCount(visibleItemEstimate+1);
      }
      if (visibleItemsCount>totalItems) {
        setVisibleItemsCount(totalItems);
      }
      let remainingItems = totalItems - currentIndex;
      if (remainingItems < visibleItemsCount) {
        setDepassement(visibleItemsCount - remainingItems);
      } else {
        setDepassement(0);
      }
    };

      updateVisibleItemsCount();
      window.addEventListener('resize', updateVisibleItemsCount);

    return () => {
        window.removeEventListener('resize', updateVisibleItemsCount);
      };
    }, [totalItems, visibleItemsCount, currentIndex]
  );

  // Fonction pour passer à l'élément suivant
  const handleNext = () => {
    if (currentIndex + visibleItemsCount < totalItems) {
      setCurrentIndex(currentIndex + 1);
      setDepassement(0);
    } else if (currentIndex + 1 < totalItems) {
      setCurrentIndex(currentIndex + 1);
      setDepassement(depassement + 1);
    } else {
      setCurrentIndex(0);
      setDepassement(0);
    }
  };

  // Fonction pour passer à l'élément précédent
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (depassement > 0) {setDepassement(depassement - 1);}
      else {setDepassement(0);}
    } else {
      setCurrentIndex(totalItems - 1);
      setDepassement(visibleItemsCount - 1);
    }
  };

  return (
    <section id="cours">
        <h2>Cours de Gestion de Comptabilité et Finance</h2>
        <div id="carrousel">
            <button id="precedent" onClick={handlePrevious}><img src="/left.png" alt="fleche gauche" /></button>
            {elemsCarrousel
              .slice(currentIndex, currentIndex + visibleItemsCount)
              .map((elem, index) => (
                <ElemCarrousel key={index} src={elem.src} img={elem.img} nom={elem.nom} />
              ))}
            {elemsCarrousel
              .slice(0, depassement)
              .map((elem, index) => (
                <ElemCarrousel key={index} src={elem.src} img={elem.img} nom={elem.nom} />
              ))}
            <button id="suivant" onClick={handleNext}><img src="/right.png" alt="fleche droite" /></button>
        </div>
    </section>
  );
}

export default Carrousel;