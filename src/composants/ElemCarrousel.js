import "../styles_composants/ElemCarrousel.css";

function ElemCarrousel({ src, img, nom }) {
    return (
        <div className="composant_carrousel">
            <img src={img} alt={img} />
            <p><a href={src}>{nom}</a></p>
        </div>
    );
}

export default ElemCarrousel;