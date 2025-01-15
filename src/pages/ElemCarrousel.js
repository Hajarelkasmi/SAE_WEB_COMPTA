import "../css/ElemCarrousel.css";
import { useRef } from "react";

function ElemCarrousel({ src, img, nom, placement_image }) {
    const imgRef = useRef(null); // Crée une référence pour l'image
    function updateImage() {
        if (imgRef.current) {
            imgRef.current.src = "/logo_bitmoji.png"; // Change la source de l'image
        }
    }
    if (!placement_image) {
        console.log("Placement image non défini");
    } else {
        console.log(`Placement image défini 6: x=${placement_image.x}, y=${placement_image.y}, width=${placement_image.width}, height=${placement_image.height}`);
    }
    return (
        <div className="composant_carrousel">
            <div className="cont_img_carrousel">
                <img ref={imgRef} src={img} alt={img} onError={updateImage}
                style={placement_image ? {
                    top: placement_image.y,
                    left: placement_image.x,
                    width: `${placement_image.width}px`,
                    height: `${placement_image.height}px`
                } : {}}
                />
            </div>
            <p><a href={src}>{nom}</a></p>
        </div>
    );
}

export default ElemCarrousel;
