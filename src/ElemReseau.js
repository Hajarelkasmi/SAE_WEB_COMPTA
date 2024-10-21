function ElemReseau({img, link}) {
    return (
        <li>
            <a href={link}><img src={img} alt="logo" className='logo' /></a>
        </li>
    );
}

export default ElemReseau;