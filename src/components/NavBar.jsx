import { Link } from "react-router-dom";
import { auth } from "../firebase";

export function CoDecoLink() {
  return (
    <div className="codeco">
      {auth.currentUser ?  null : <Link to="/inscription"> Inscription </Link> }
      <Link to="/zut"> zut </Link>
      <Link to="/essai"> essai </Link>
      {auth.currentUser ?  <Link to="/disconnexion"> Déconnexion </Link> : <Link to="/connexion"> Connexion </Link>} 
    </div>
  );
}
