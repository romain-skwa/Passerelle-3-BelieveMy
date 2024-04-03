import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";

export function CoDecoLink() {
  // Variable
  const { logOut } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="codeco">
      {auth.currentUser ?  null : <Link to="/inscription"> Inscription </Link> }
      <Link to="/zut"> zut </Link>
      <Link to="/essai"> essai </Link>
      <Link to="/envoi"> envoi </Link>
      {user && <Link to="/ChangeMyPseudo"> ChangeMyPseudo </Link>}
      {auth.currentUser ?  <div onClick={() => logOut()} to="/disconnexion" style={{ cursor: "pointer" }}> Déconnexion </div> : <Link to="/connexion"> Connexion </Link>} 
    </div>
  );
}
