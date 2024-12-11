import "../css/Carrousel.css";
import ElemCarrousel from "./ElemCarrousel";
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
            for (const element of data) {
                element.src = "/categories/"+element.id;
                if (element.image === null) {
                    element.img = "/logo_bitmoji.png";
                } else {
                    element.img = element.image;
                }
                elems.push(element);
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
                for (const element of elems) {
                    element.src = "/categories/"+element.id;
                    if (element.image === null) {
                        element.img = "/logo_bitmoji.png";
                    } else {
                        element.img = element.image;
                    }
                }
                //  donner leur place depuis elemsCarrousel
                for (const element of elemsCarrousel) {
                    let elemIndex = elems.findIndex(e => e.id === element.id);
                    if (elemIndex !== -1) {
                        elems[elemIndex] = element;
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
        for (const element of allElems) {
            let elemIndex = elemsCarrousel.findIndex(e => e.id === element.id);
            if (elemIndex !== -1) {
                selected.push(element);
            } else {
                notSelected.push(element);
            }
        }
        // trier les éléments selectionnés par place
        selected.sort((a, b) => a.place - b.place);
        setElemsSelected(selected);
        setElemsNotSelected(notSelected);
    }, [allElems]);

    const handleDragStart = (e, item, source) => {
        e.dataTransfer.setData("item", JSON.stringify(item));
        e.dataTransfer.setData("source", source);
    };

    const handleDrop = (e, targetList) => {
        e.preventDefault();

        const item = JSON.parse(e.dataTransfer.getData("item"));
        const source = e.dataTransfer.getData("source");

        if (source === targetList) return;

        if (targetList === "selected") {
            setElemsNotSelected((prev) => prev.filter((elem) => elem.id !== item.id));
            setElemsSelected((prev) => [
                ...prev,
                { ...item, place: prev.length },
            ]);
        } else if (targetList === "notSelected") {
            setElemsSelected((prev) => prev.filter((elem) => elem.id !== item.id));
            setElemsNotSelected((prev) => [...prev, item]);
        }
    };

    const handleReorder = (e, targetId) => {
        e.preventDefault();

        const draggedItem = JSON.parse(e.dataTransfer.getData("item"));

        setElemsSelected((prev) => {
            const draggedIndex = prev.findIndex((e) => e.id === draggedItem.id);
            const targetIndex = prev.findIndex((e) => e.id === targetId);

            const updated = [...prev];
            const [removed] = updated.splice(draggedIndex, 1);
            updated.splice(targetIndex, 0, removed);

            // Mise à jour des places
            return updated.map((elem, index) => ({ ...elem, place: index }));
        });
    };

    return (
        <section id="cours">
            <h2>Cours de Gestion de Comptabilité et Finance</h2>
            <div id="carrousel">
                <button id="precedent" onClick={handlePrevious}><img src="/left.png" alt="fleche gauche" /></button>
                {elemsCarrousel
                  .slice(currentIndex, currentIndex + visibleItemsCount)
                  .map((elem, index) => (
                    <ElemCarrousel key={"e"+index} src={elem.src} img={elem.img} nom={elem.nom} />
                  ))}
                {elemsCarrousel
                  .slice(0, depassement)
                  .map((elem, index) => (
                    <ElemCarrousel key={"d"+index} src={elem.src} img={elem.img} nom={elem.nom} />
                  ))}
                <button id="suivant" onClick={handleNext}><img src="/right.png" alt="fleche droite" /></button>
            </div>
            {isAdmin && 
                <div id="modification_cours">
                    {modifyElems ?
                        <>
                            <button id="annuler" onClick={() => handleModify(false)}>Annuler les modifications</button>
                            <button id="valider" onClick={() => handleModify(true)}>Valider les modifications</button>
                        </>
                        :
                        <button id="modifier" onClick={handleModify}>Modifier le carrousel</button>
                    }

                    {modifyElems && (
                        <DragDropContext>
                            <Droppable droppableId="selected" direction="horizontal">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        <h3>Éléments sélectionnés</h3>
                                        <div id="in-carrousel-items">
                                            {elemsSelected.map((elem, index) => (
                                                <Draggable key={elem.id} draggableId={elem.id.toString()} index={index}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="carrousel-item">
                                                            <ElemCarrousel src={elem.src} img={elem.img} nom={elem.nom} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ), [elemsSelected])}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                            <Droppable droppableId="notSelected" direction="horizontal vertical">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        <h3>Éléments non sélectionnés</h3>
                                        <div id="not-in-carrousel-items">
                                            {elemsNotSelected.map((elem, index) => (
                                                <Draggable key={elem.id} draggableId={elem.id.toString()} index={index}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="carrousel-item">
                                                            <ElemCarrousel src={elem.src} img={elem.img} nom={elem.nom} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ), [elemsNotSelected])}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </div>
            }
        </section>
    );
}

export default Carrousel;