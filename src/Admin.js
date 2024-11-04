import Demande from "./Demande";
import Compte from "./Compte";
import './Admin.css';
import Container_Admin_Stat from "./Container_Admin_Stat";

function Admin() {
    const demande = Demande();
    const compte = Compte();
    const container_admin_stat = Container_Admin_Stat();
    return (
        <div>
            <h1>Administration</h1>
            {demande}
            {compte}
            {container_admin_stat}
        </div>
    );
}

export default Admin;