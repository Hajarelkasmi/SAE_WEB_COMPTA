function ElemBandeau({link, text, enfants=[]}) {
    return (
    <li>
        <a href={link}>{text}</a>
        <ul>
            {enfants.map((enfant, index) => (
                <ElemBandeau key={index} link={enfant.link} text={enfant.text} enfants={enfant.enfants} />
            ))}
        </ul>
    </li>
    );
}

export default ElemBandeau;