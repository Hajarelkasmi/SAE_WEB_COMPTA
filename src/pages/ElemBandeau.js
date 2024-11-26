function ElemBandeau({ link, nom, enfants = [], isAdmin = false }) {
    if (enfants.length === 0) {
        return (
            <li>
                <a href={link}>{nom}</a>
            </li>
        );
    }
    return (

        //<li className="deroulant">
            //<a href={link}>{nom}</a>
            //<ul className="sous" style={{ backgroundColor: isAdmin ? '#a63629' : '#1c3f59' }}>
                //{enfants.map((enfant, index) => (
                    //(enfant.link) ? 
                        //<ElemBandeau key={index} link={enfant.link} nom={enfant.nom} enfants={enfant.enfants} isAdmin={isAdmin} /> 
                    //:  <ElemBandeau key={index} link={"/categories/" + enfant.id} nom={enfant.nom} enfants={enfant.enfants} isAdmin={isAdmin} />
                //))}
            //</ul>
        //</li>

    <li className="deroulant">
        <a href={link}>{nom}</a>
        <ul className="sous">
            {enfants.map((enfant) => (
                <ElemBandeau key={enfant.id} link={"/categories/" + enfant.id} nom={enfant.nom} enfants={enfant.enfants} />
            ))}
        </ul>
    </li>

    );
}

export default ElemBandeau;