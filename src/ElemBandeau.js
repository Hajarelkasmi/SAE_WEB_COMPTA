function ElemBandeau({link, text, enfants=[]}) {
    if (enfants.length === 0) {
        return (
            <li>
                <a href={link}>{text}</a>
            </li>
        );
    }
    return (
    <li class="deroulant">
        <a href={link}>{text}</a>
        <ul class="sous">
            {enfants.map((enfant, index) => (
                <ElemBandeau key={index} link={enfant.link} text={enfant.text} enfants={enfant.enfants} />
            ))}
        </ul>
    </li>
    );
}

export default ElemBandeau;