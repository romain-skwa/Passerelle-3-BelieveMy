import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../store/AuthProvider";
import GridLoader from "react-spinners/GridLoader";
import Title from "../components/Title";
import { CoDecoLink } from "../components/NavBar";
import { SayHello } from "../components/Hello/Hello";
import FrameRightMessage from "../components/FrameRightMessage";
import  ListDialogue  from "../components/FrameLeft/ListDialogue";
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

      <section style={{position:"fixed", top:"6vh", left:"15vw"}}>
        <SayHello />
        <CoDecoLink /* Les liens page accueil, mes auteurs suivis, mes tweets, mon profil, connexion/déconnexion */ />
      </section>

      <FrameLeft /* nouveaux messages --- Conversations déjà entamées --- Liste des auteurs que vous suivez */ />
      <FrameRightMessage /* Fenêtre de dialogue située à droite */ />
      <Outlet />
      
    </main>
  );
}
