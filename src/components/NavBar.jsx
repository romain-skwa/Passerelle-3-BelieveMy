import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import { SayHello } from "./Hello/Hello";

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
    <div className="SayHelloCoDecoLink">
      <SayHello />

      {auth.currentUser ?
        <div onClick={handleLogout} className="buttonsAnim" style={{ cursor: "pointer" }}> Déconnexion </div>
         : 
         <Link to="/connexion" className="buttonsAnim" style={{ cursor: "pointer" }} > Connexion </Link>
        } 
      <Link className="buttonsAnim" to="/" >Page d&apos;accueil</Link>
      {user && <Link className="buttonsAnim" to="/MyFollowedAuthors"> Mes abonnements </Link>}
      {user && <Link className="buttonsAnim" to="/MyTweets"> Mes propres Tweets </Link>}
      {user && <Link className="buttonsAnim" to="/MyProfile"> Modifier mon profil </Link>}
      {auth.currentUser ?  null : <Link className="buttonsAnim" to="/inscription" > Inscription </Link> }
    </div>
  );
}
