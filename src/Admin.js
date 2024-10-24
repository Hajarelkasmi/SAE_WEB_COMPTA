import Demande from "./Demande";
import Compte from "./Compte";

function Admin() {
    const demande = Demande();
    const compte = Compte();
    return (
        <div>
            <h1>Administration</h1>
            {demande}
            {compte}
        </div>
    );
}

export default Admin;