import "../css/Erreur.css";

function Erreur({numero, message}) {
  return (
    <div id="erreur">
        <h1>Erreur {numero}</h1>
        <p>{message}</p>
    </div>
  );
}

export default Erreur;