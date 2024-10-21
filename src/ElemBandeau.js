function ElemBandeau({link, nom, enfants=[]}) {
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
        <ul className="sous">
            {enfants.map((enfant, index) => (
                <ElemBandeau key={index} link={enfant.link} nom={enfant.nom} enfants={enfant.enfants} />
            ))}
        </ul>
    </li>
    );
}

export default ElemBandeau;