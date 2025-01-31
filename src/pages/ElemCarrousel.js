import "../css/ElemCarrousel.css";
import { useRef } from "react";

function ElemCarrousel({ src, img, nom, placement_image, dans_carrousel_item }) {
    const imgRef = useRef(null); // Crée une référence pour l'image
    function updateImage() {
        if (imgRef.current) {
            imgRef.current.src = "/logo_bitmoji.png"; // Change la source de l'image
        }
    }
    if (dans_carrousel_item && placement_image) {
        placement_image = {
            x: placement_image.x/1.6,
            y: placement_image.y/1.6,
            width: placement_image.width/1.6,
            height: placement_image.height/1.6
        };
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
