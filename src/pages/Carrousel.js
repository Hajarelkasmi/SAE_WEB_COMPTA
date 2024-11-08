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
    const [elemsCarrousel, setElemsCarrousel] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/carrousel', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            let elems = [];
            for (let i=0; i<data.length; i++) {
                data[i].src = "/categories/"+data[i].id_categorie;
                if (data[i].image === null) {
                    data[i].img = "/logo_bitmoji.png";
                } else {
                    data[i].img = data[i].image;
                }
                elems.push(data[i]);
            }
            setElemsCarrousel(elems);
            setTotalItems(elems.length);
        })
        .catch(error => console.error(error));
    }, []);
  
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
    const [elemsSelected, setElemsSelected] = useState([]);
    const [elemsNotSelected, setElemsNotSelected] = useState([]);
    async function handleModify(modify) {
        if (modify) {
            if (modifyElems) {
                // supprimer les cours existants du carrousel
                await fetch('http://localhost:5000/api/carrousel', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                    }
                }).catch(error => console.error(error));
                // ajouter les cours sélectionnés dans le carrousel
                let newElems = elemsSelected;
                for (let i=0; i<newElems.length; i++) {
                    console.log(newElems[i] + ";" + i + ";" + newElems[i].id);
                    let response = await fetch('http://localhost:5000/api/carrousel', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token'),
                        },
                        body: JSON.stringify({
                            id_categorie: newElems[i].id,
                            place: i
                        })
                    }).catch(error => console.error(error));
                    let data = await response.json();
                    console.log(data);
                    // mettre l'element à jour dans newsElems
                    newElems[i].place = data.place;
                }
                setElemsCarrousel(newElems);
                setTotalItems(newElems.length);
            } else {
                // récupérer tous les cours
                let elems = [];
                elems = await fetch('http://localhost:5000/api/categories', {
                    method: 'GET',
                }).then(response => response.json()).catch(error => console.error(error));
                for (let i=0; i<elems.length; i++) {
                    elems[i].src = "/categories/"+elems[i].id;
                    if (elems[i].image === null) {
                        elems[i].img = "/logo_bitmoji.png";
                    } else {
                        elems[i].img = elems[i].image;
                    }
                }
                //  donner leur place depuis elemsCarrousel
                for (let i=0; i<elemsCarrousel.length; i++) {
                    let elemIndex = elems.findIndex(e => e.id === elemsCarrousel[i].id);
                    if (elemIndex !== -1) {
                        elems[elemIndex] = elemsCarrousel[i];
                    }
                }
                setAllElems(elems);
            }
        }
        setModifyElems(!modifyElems);
    }

    useEffect(() => {
        // mettre dans elemsSelected et elemsNotSelected les cours déjà dans le carrousel et ceux qui ne le sont pas
        let selected = [];
        let notSelected = [];
        for (let i=0; i<allElems.length; i++) {
            let elemIndex = elemsCarrousel.findIndex(e => e.nom === allElems[i].nom);
            if (elemIndex !== -1) {
                selected.push(allElems[i]);
            } else {
                notSelected.push(allElems[i]);
            }
        }
        // trier les éléments selectionnés par place
        selected.sort((a, b) => a.place - b.place);
        setElemsSelected(selected);
        setElemsNotSelected(notSelected);
    }, [allElems]);

    function handleModifyElem(event) {
        // trouver le bouton cliqué
        let elem = event.target;
        while (elem.tagName !== "BUTTON") {
            elem = elem.parentElement;
            if (elem === null) {return;}
        }
        // si la div est elems_carrousel_not_selected
        if (elem.parentElement.id === "cours_carrousel_not_selected") {
            let id = elem.id.split("_")[1];
            let cours = allElems[id];
            // Ajouter le cours à elemsSelected
            cours.place = elemsSelected.length;
            setElemsSelected((prevSelected) => [...prevSelected, cours]);
            // Enlever le cours de elemsNotSelected
            setElemsNotSelected((prevNotSelected) =>
                prevNotSelected.filter(e => e.id !== cours.id)
            );
        }
        else if (elem.parentElement.id === "cours_carrousel_selected") {
            let id = elem.id.split("_")[1];
            let cours = allElems[id];
            cours.place = null;
            // Ajouter le cours à elemsNotSelected
            setElemsNotSelected((prevNotSelected) => [...prevNotSelected, cours]);
            // Enlever le cours de elemsSelected
            setElemsSelected((prevSelected) =>
                prevSelected.filter(e => e.id !== cours.id)
            );
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
                    {modifyElems && <p>Categories sélectionnées</p>}
                    {modifyElems &&
                        <div id="cours_carrousel_selected" onClick={handleModifyElem}>
                            {elemsSelected.map((elem) => (
                                <button key={"cours"+elem.id} className="cours" id={"cours_"+elem.id}><ElemCarrousel key={elem.id} src={elem.src} img={elem.img} nom={elem.nom + " " + elem.place} /></button>
                            ))}
                        </div>
                    }
                    {modifyElems && <p>Categories non sélectionnées</p>}
                    {modifyElems &&
                        <div id="cours_carrousel_not_selected" onClick={handleModifyElem}>
                            {elemsNotSelected.map((elem) => (
                                <button key={"cours"+elem.id} className="cours" id={"cours_"+elem.id}><ElemCarrousel key={elem.id} src={elem.src} img={elem.img} nom={elem.nom + " " + elem.place} /></button>
                            ))}
                        </div>
                    }
                </div>
            }
        </section>
    );
}

export default Carrousel;