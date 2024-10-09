function ElemReseau({img, link}) {
    return (
        <li>
            <a href={link}><img src={img} alt="logo" class='logo' /></a>
        </li>
    );
}

export default ElemReseau;