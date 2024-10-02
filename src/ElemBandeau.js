function ElemBandeau({link, text}) {
    return (
    <li>
    <a
        className="App-link"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
    >
        {text}
    </a>
    </li>
    );
}

export default ElemBandeau;