import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";

// Ce composant est dans layouts/Main.jsx

export function CoDecoLink() {
  // Variable
  const { logOut } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/home", { replace: true });
  };

  return (
    <div className="codeco apparition">
      {auth.currentUser ?  <div onClick={handleLogout} style={{ cursor: "pointer" }}> Déconnexion </div> : <Link to="/connexion"> Connexion </Link>} 
      <Link to="/" style={{marginTop:"1rem"}}>Page d&apos;accueil</Link>
      {user && <Link to="/MyFollowedAuthors" style={{marginTop:"0.3rem"}}> Mes abonnements </Link>}
      {user && <Link to="/MyTweets" style={{marginTop:"0.3rem"}}> Mes propres Tweets </Link>}
      {user && <Link to="/MyProfile" style={{marginTop:"0.3rem"}}> Mon profil </Link>}
      {auth.currentUser ?  null : <Link to="/inscription"> Inscription </Link> }
    </div>
  );
}
