function ElemBandeau({ link, nom, enfants = [], isAdmin = false }) {
    if (enfants.length === 0) {
        return (
            <li>
                <a href={link}>{nom}</a>
            </li>
        );
    }
    return (
        <li className="deroulant">
            <a href={link}>{nom}</a>
            <ul className="sous" style={{ backgroundColor: isAdmin ? '#a63629' : '#1c3f59' }}>
                {enfants.map((enfant, index) => (
                    <ElemBandeau key={index} link={"/categories/" + enfant.id} nom={enfant.nom} enfants={enfant.enfants} isAdmin={isAdmin} />
                ))}
            </ul>
        </li>
    );
}

export default ElemBandeau;