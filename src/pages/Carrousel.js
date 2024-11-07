import "../css/Carrousel.css";
import ElemCarrousel from "./ElemCarrousel";
import React, { useState, useEffect } from 'react';

function Carrousel() {
    // Vérifier si l'utilisateur est admin
    const [isAdmin, setIsAdmin] = useState(null);
    useEffect(() => {
        const checkAdmin = async () => {
            const token = localStorage.getItem('token');
            if (token === null) {
                setIsAdmin(false);
                return;
            }
            try {
                const response = await fetch('http://localhost:5000/api/isAdmin', {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                if (!response.ok) {setIsAdmin(false);}
                const data = await response.json();
                setIsAdmin(data.isAdmin);
            } catch (error) {
                setIsAdmin(false);
            }
        };
        checkAdmin();
    }, []);

    // Liste des éléments du carrousel
    const [elemsCarrousel, setElemsCarrousel] = useState([
        {src: "/Cours 1", img: "/logo_bitmoji.png", nom: "COMPTABILITÉ APPROFONDIE"},
        {src: "/Cours 2", img: "/youtube_logo.png", nom: "COMMUNICATION"},
        {src: "/Cours 3", img: "/tiktok_logo.png", nom: "COMPTABILITÉ FINANCIÈRE"},
        {src: "/Cours 4", img: "/logo192.png", nom: "CONTRÔLE DE GESTION"},
        {src: "/Cours 5", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS75ebrwvgVW5Ks_oLfCbG8Httf3_9g-Ynl_Q&s", nom: "GESTION FINANCIERE"},
    ]);
  
    const [currentIndex, setCurrentIndex] = useState(0);
    const [depassement, setDepassement] = useState(0);
    const [visibleItemsCount, setVisibleItemsCount] = useState(4);

    const [totalItems, setTotalItems] = useState(elemsCarrousel.length);

    // Calcul du nombre d'éléments visibles en fonction de la taille de la fenêtre et du nombre total d'éléments
    useEffect(() => {
        const updateVisibleItemsCount = () => {
            let visibleItemEstimate = (window.innerWidth - 480) / 288 + 1;
            let visibleItemCountTemp;
            if (visibleItemEstimate < 1) { // si visibleItemEstimate vaut 0 ou moins
                visibleItemCountTemp = 1;
            } else if (visibleItemEstimate > 4) { // si visibleItemEstimate vaut plus de 4 (max d'elems voulus en même temps)
                visibleItemCountTemp = 4;
            } else { // entre les deux
                visibleItemCountTemp = visibleItemEstimate+1;
            }
            if (visibleItemCountTemp>totalItems) {
                visibleItemCountTemp = totalItems;
            }
            setVisibleItemsCount(visibleItemCountTemp);
            let remainingItems = totalItems - currentIndex;
            if (remainingItems < visibleItemCountTemp) {
                setDepassement(visibleItemCountTemp - remainingItems);
            } else {
                setDepassement(0);
            }
        };

        updateVisibleItemsCount();
        window.addEventListener('resize', updateVisibleItemsCount);

        return () => {
            window.removeEventListener('resize', updateVisibleItemsCount);
        };
    }, [totalItems, currentIndex]);

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

    // Fonction pour modifier les éléments du carrousel
    const [modifyElems, setModifyElems] = useState(false);
    const [allElems, setAllElems] = useState(elemsCarrousel);
    async function handleModify(modify) {
        if (modify) {
            if (modifyElems) {
                // récupérer les cours en vert
                let elems = [];
                let buttons = document.getElementsByClassName("cours");
                for (let i=0; i<buttons.length; i++) {
                    if (buttons[i].style.backgroundColor === "green") {
                        elems.push(allElems[i]);
                    }
                }
                setElemsCarrousel(elems);
                setTotalItems(elems.length);
            } else {
                // récupérer tous les cours
                let elems = [];
                elems = await fetch('http://localhost:5000/api/bandeau', {
                    method: 'GET',
                }).then(response => response.json());
                console.log(elems);
                setAllElems(elems);
            }
        }
        setModifyElems(!modifyElems);
    }

    useEffect(() => {
        if (modifyElems) {
            allElems.forEach((elem, index) => {
                //  récupérer le nom du cours (ex: compta)
                let button = document.getElementById("cours_"+index);
                // vérifier si le cours est déjà dans le carrousel à partir du nom
                let elemIndex = elemsCarrousel.findIndex(e => e.nom === elem.nom);
                if (elemIndex !== -1) { // si le cours est déjà dans le carrousel
                    button.style.backgroundColor = "green";
                } else {
                    button.style.backgroundColor = "";
                }
            });
        }
    }, [allElems]);

    function handleModifyElem(event) {
        // trouver le bouton cliqué
        let elem = event.target;
        while (elem.tagName !== "BUTTON") {
            elem = elem.parentElement;
            if (elem === null) {return;}
        }
        // changer la couleur du bouton
        if (elem.style.backgroundColor === "green") {
            elem.style.backgroundColor = "";
        } else {
            elem.style.backgroundColor = "green";
        }
    }

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
            {isAdmin && 
                <div id="modification_cours">
                    {modifyElems ? <><button id="annuler" onClick={() => handleModify(false)}>Annuler les modifications</button><button id="valider" onClick={() => handleModify(true)}>Valider les modifications</button></> : <button id="modifier" onClick={handleModify}>Modifier le carrousel</button>}
                    {modifyElems &&
                        <div id="cours_carrousel" onClick={handleModifyElem}>
                            {allElems.map((elem, index) => (
                                <button key={"cours"+index} className="cours" id={"cours_"+index}><ElemCarrousel key={index} src={elem.src} img={elem.img} nom={elem.nom} /></button>
                            ))}
                        </div>
                    }
                </div>
            }
        </section>
    );
}

export default Carrousel;