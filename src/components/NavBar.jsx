import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";

// Ce composant est dans layouts/Main.jsx

export function CoDecoLink() {
  // Variable
  const { logOut } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="codeco apparition">
      {auth.currentUser ?  <div onClick={() => logOut()} to="/" style={{ cursor: "pointer" }}> Déconnexion </div> : <Link to="/connexion"> Connexion </Link>} 
      <Link to="/">Page d&apos;accueil</Link>
      {user && <Link to="/MyFollowedAuthors"> MyFollowedAuthors </Link>}
      {user && <Link to="/MyTweets"> MyTweets </Link>}
      {user && <Link to="/MyProfile"> MyProfile </Link>}
      {auth.currentUser ?  null : <Link to="/inscription"> Inscription </Link> }
    </div>
  );
}
