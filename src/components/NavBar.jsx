import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";

export function CoDecoLink() {
  // Variable
  const { logOut } = useContext(AuthContext);
  return (
    <div className="codeco">
      {auth.currentUser ?  null : <Link to="/inscription"> Inscription </Link> }
      <Link to="/zut"> zut </Link>
      <Link to="/essai"> essai </Link>
      {auth.currentUser ?  <div onClick={() => logOut()} to="/disconnexion"> Déconnexion </div> : <Link to="/connexion"> Connexion </Link>} 
    </div>
  );
}
