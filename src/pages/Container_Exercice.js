import React from 'react';

const Container_Exercice = ({ rubrique }) => {
    return (
        <div>
            <h2>{rubrique.nom}</h2>
            <p>{rubrique.description}</p>
            <a href={rubrique.lien}>{rubrique.lien}</a>
        </div>
    );
}

export default Container_Exercice;