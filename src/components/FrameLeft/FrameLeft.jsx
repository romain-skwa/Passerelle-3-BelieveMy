import AlertMessage from "../Message/AlertMessage"; // Indication des nouveaux messages
import ListDialogue from "./ListDialogue"; // Conversations déjà entamées
import ListFollowed from "./ListFollowed"; // Liste des auteurs que vous suivez
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { CoDecoLink } from "../../components/NavBar";
import { SayHello } from "../../components/Hello/Hello";
// Ensemble des sections formant une colonne à gauche de l'écran
    // Partie : vous avez un message
    // Partie : Vos conversations
    // Partie : auteurs que vous suivez

export default function FrameLeft() {
    const { user, } = useContext(AuthContext);
    return(
        <>               
            <div className="framelistDialogue">

                <section className="SayHelloCoDecoLink">
                    <SayHello />
                    <CoDecoLink /* Les liens page accueil, mes auteurs suivis, mes tweets, mon profil, connexion/déconnexion */ />
                </section>

                { user ? (
                    <>
                        <section>
                            <AlertMessage />
                            <ListDialogue />
                            <ListFollowed />
                        </section>
                    </>
                ) : null }
          </div>
        </>
    )
}