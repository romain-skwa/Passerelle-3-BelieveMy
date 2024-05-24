import AlertMessage from "../Message/AlertMessage"; // Indication des nouveaux messages
import ListDialogue from "./ListDialogue"; // Conversations déjà entamées
import ListFollowed from "./ListFollowed"; // Liste des auteurs que vous suivez
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";

export default function FrameLeft() {
    const { user, } = useContext(AuthContext);
    return(
        <>
        { user ? (
            <section className="listDialogue">
            <AlertMessage />
            <ListDialogue />
            <ListFollowed />
            </section>
        ) : null }
        
        </>
    )
}