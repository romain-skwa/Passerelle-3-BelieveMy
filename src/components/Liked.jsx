import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/AuthProvider";
import { GetAuthorTweet } from "./GetAuthorTweet";

export default function Liked(props) {
    const { tweet } = props;
    const { user } = useContext(AuthContext);
    const { idOfConnectedUser, pseudonymConnectedUser, mailOfConnectedUser, followListOfConnectedUser, likedListOfConnectedUser, actualiserLikedList } = useContext(AuthContext);
    const [preventLikedList, setPreventLikedList] = useState(likedListOfConnectedUser || []);
    const saveContent = likedListOfConnectedUser; // Pour sauvegarder une copie de la liste des tweets aimés par l'utilisateur.

    useEffect(() => {
        setPreventLikedList(likedListOfConnectedUser || []);
        return () => setPreventLikedList([]);
      }, [likedListOfConnectedUser]);

    const likeThisTweet = async () => {
        if (!preventLikedList.includes(tweet.id)) { // Vérifier que le tweet en question n'est pas déjà présent dans preventLikedList
          const newDataLikedList = {
            mailUser: mailOfConnectedUser,
            pseudonymUser: pseudonymConnectedUser,
            followList: followListOfConnectedUser,
            likedList: [...preventLikedList, tweet.id]
        };
        console.log("Données à envoyer à Firebase  depuis le composant Liked : ", newDataLikedList);
    
          const change = await fetch(
            `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/userList/${idOfConnectedUser}.json`,
            {
              method: "PUT", // La méthode PUT pour POSER de nouvelles données
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newDataLikedList), // stringify pour mettre sous forme de caractère un objet javascript
            }
          );
    
          if (!change.ok) {
            toast.error("Erreur !"); // Toast affiche un message d'erreur.
            setPreventLikedList(saveContent);
            return;
          }
          actualiserLikedList(newDataLikedList.likedList);// Mettre à jour la liste de like dans le contexte

        }
    }
    return(
        <>
            {
                user  ? (
                <>
                    {preventLikedList.includes(tweet.id) ? 
                    (
                        <p style={{ color: "green" }}>Déjà liké</p>
                    ) : (
                        <button onClick={likeThisTweet}>
                            J'aime ce tweet
                        </button>
                    )}
                </>
                ) : ("troululu")
            }
        </>
    )
}
