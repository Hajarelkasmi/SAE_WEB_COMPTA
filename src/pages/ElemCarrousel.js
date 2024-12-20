import "../css/ElemCarrousel.css";
import { useRef } from "react";

function ElemCarrousel({ src, img, nom }) {
    const imgRef = useRef(null); // Crée une référence pour l'image
    function updateImage() {
        if (imgRef.current) {
            imgRef.current.src = "/logo_bitmoji.png"; // Change la source de l'image
        }
    }
    return (
        <div className="composant_carrousel">
            <div className="cont_img_carrousel">
                <img ref={imgRef} src={img} alt={img} onError={updateImage} 
                // style={{
                //     width: "50px",
                //     height: "80px",
                //     top: "30px",
                //     left: "10px",
                // }}
                />
            </div>
            <p><a href={src}>{nom}</a></p>
        </div>
    );
}

export default ElemCarrousel;
