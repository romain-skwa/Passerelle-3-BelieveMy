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
      <Link to="/">Page d&apos;accueil</Link>
      {auth.currentUser ?  null : <Link to="/inscription"> Inscription </Link>}
      {user && <Link to="/MyFollowedAuthors"> MyFollowedAuthors </Link>}
      {user && <Link to="/MyTweets"> MyTweets </Link>}
      {user && <Link to="/MyProfile"> MyProfile </Link>}
      {auth.currentUser ?  <div onClick={() => logOut()} to="/disconnexion" style={{ cursor: "pointer" }}> Déconnexion </div> : <Link to="/connexion"> Connexion </Link>} 
    </div>
  );
}
