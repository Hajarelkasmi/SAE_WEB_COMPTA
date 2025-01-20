function ElemBandeau({ link, nom, enfants = [], isAdmin = false, className = "" }) {
    const currentPath = window.location.pathname;
    const isActive = currentPath.includes(link) || enfants.some(enfant => currentPath.includes(enfant.link ? enfant.link : `/categories/${enfant.id}`));
    const classes = `deroulant ${className} ${isActive ? 'active' : ''}`.trim();

    if (enfants.length === 0) {
        return (
            <li className={className}>
                <a href={link}>{nom}</a>
            </li>
        );
    }
    return (
        <li className={classes}>
            <a href={link}>{nom}</a>
            <ul className="sous">
                {enfants.map((enfant, index) => (
                    <ElemBandeau
                        key={index}
                        link={enfant.link ? enfant.link : `/categories/${enfant.id}`}
                        nom={enfant.nom}
                        enfants={enfant.enfants}
                        isAdmin={isAdmin}
                        className={currentPath.includes(enfant.link ? enfant.link : `/categories/${enfant.id}`) ? 'active' : ''}
                    />
                ))}
            </ul>
        </li>
    );
}

export default ElemBandeau;