import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../store/AuthProvider";
import GridLoader from "react-spinners/GridLoader";
import Title from "../components/Title";
import FrameRightMessage from "../components/FrameRightMessage";
import FrameLeft from "../components/FrameLeft/FrameLeft";

export default function Main() {
  // Variables
  const { loading,  } = useContext(AuthContext);

  if (loading) {
    return  (
      <>
        <Title/>
        <GridLoader color="#36d7b7" size={30} />
      </>     
    )
  }

  return (
    <main>
      <div id="top"/* Ancre */></div>
      <FrameLeft 
        /*  Bonjour/Liens -- Connexion/Déconnexion -- Page d'accueil -- Inscription
        --- nouveaux messages 
        --- Conversations déjà entamées 
        --- Liste des auteurs que vous suivez 
        */ 
      />
      <FrameRightMessage /* Fenêtre de dialogue située à droite */ />
      <Outlet />
      <a href="#top" className="scroll-to-top" /* Lien pour Ancre */>
        <img src="../../icone/arrow-up-filled-circle-icon.png" alt="fleche-vers-le-haut" />
      </a>
    </main>
  );
}
