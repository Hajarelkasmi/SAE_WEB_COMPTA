function ElemReseau({img, link}) {
    return (
        <li>
            <a href={link} target="_blank" rel="noreferrer"><img src={img} alt="logo" className='logo' /></a>
        </li>
    );
}

export default ElemReseau;