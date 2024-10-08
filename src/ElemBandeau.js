function ElemBandeau({link, text, enfants=[]}) {
    return (
    <li>
        <a href={link}>{text}</a>
    </li>
    );
}

export default ElemBandeau;