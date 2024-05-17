import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { Link } from "react-router-dom";

/* 
Ce composant est à l'intérieur de Liked
Il s'affiche seulement une fois que le bouton "J'aime ce tweet" a été cliqué afin que le bouton qui vient d'être cliqué
soit remplacé par un autre bouton "Je n'aime plus ce tweet".

Lorsque que ce nouveau bouton sera cliqué, le compteur de like concernant ce tweet ciblé sera décrémenté et
l'identifiant du tweet sera supprimé de la liste inclus dan sla donnée "LikedList".

La fonction actualiserLikedList va mettre à jour la liste dans la contexte, ce qui va actualiser la liste de tweet à 
chaque clic.
*/
export default function Liked(props) {
  const { tweet, likeThisTweet, requete } = props;
  const { user } = useContext(AuthContext);

  const {
    idOfConnectedUser,
    pseudonymConnectedUser,
    mailOfConnectedUser,
    followListOfConnectedUser,
    likedListOfConnectedUser,
    actualiserLikedList,
  } = useContext(AuthContext);

  const [preventLikedList, setPreventLikedList] = useState(
    likedListOfConnectedUser || []
  );

  const saveContent = likedListOfConnectedUser; // Pour sauvegarder une copie de la liste des tweets aimés par l'utilisateur.

  useEffect(() => {
    setPreventLikedList(likedListOfConnectedUser || []);
    return () => setPreventLikedList([]);
  }, [likedListOfConnectedUser]);

  // PARTIE 1
  const unlikeThisTweet  = async () => {
    if (preventLikedList.includes(tweet.id)) {
      // Vérifier que le tweet en question n'est pas déjà présent dans preventLikedList
      const GetOffLikeList = {
        mailUser: mailOfConnectedUser,
        pseudonymUser: pseudonymConnectedUser,
        followList: followListOfConnectedUser,
        likedList: preventLikedList.filter((id) => id !== tweet.id),
        };

     // console.log("Données à envoyer à Firebase  depuis le composant GetOffLike : ", GetOffLikeList);

      const change = await fetch(
        `https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app/userList/${idOfConnectedUser}.json`,
        {
          method: "PUT", // La méthode PUT pour POSER de nouvelles données
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(GetOffLikeList), // stringify pour mettre sous forme de caractère un objet javascript
        }
      );

      if (!change.ok) {
        toast.error("Erreur !"); // Toast affiche un message d'erreur.
        setPreventLikedList(saveContent);
        return;
      }
      actualiserLikedList(GetOffLikeList.likedList); // Mettre à jour la liste de like dans le contexte
    }
    /* -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- */
    // PARTIE 2

   // console.log("Fonction likeThisTweet appelée");

    // Récupère la valeur de likedCounter dans Firebase
    const response = await fetch(
        `https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app/commentaries/${tweet.id}/likedCounter.json`,
    );
    const currentLikedCounter = await response.json();

    // Incrémente la valeur actuelle de likedCounter de 1
    const newLikedCounterValue = currentLikedCounter - 1;

    // Envoi de la requête PUT pour remplacer la valeur dans Firebase
    const putResponse = await fetch(
        `https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app/commentaries/${tweet.id}/likedCounter.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLikedCounterValue),
      }
    );

    if (!putResponse.ok) {
      const errorBody = await putResponse.json();
      console.error("Error:", errorBody.error);
    } else {
     // console.log("Je décrémente LikedCounter dans le tweet : " + tweet.title);
    }
    props.requete();

  };
  return (
    <>
      {user ? (
        <>
          {preventLikedList.includes(tweet.id) ? (
            <div onClick={unlikeThisTweet} className="red_like"></div>
          ) : (
            <img onClick={likeThisTweet} className="empty_like" src="../../../icone/empty_red.png" />
          )}
        </>
      ) : (
        <Link to="/connexion"><img className="empty_like" src="../../../icone/empty_red.png" /></Link>
      )}
    </>
  );
}
