import { Link } from "react-router-dom";
import Title from "../components/Title";
export default function CoDeco(){
    return(
        <>
        <div>
            <Title />
            <p>Ceci sera la page de connexion...................................</p>
        </div>
        <div><Link to="/"> Retour à l&apos;accueil</Link></div>
        </>
    )
}