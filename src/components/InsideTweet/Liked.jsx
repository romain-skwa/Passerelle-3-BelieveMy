import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { Link } from "react-router-dom";

import GetOffLike from "./GetOffLike";

/* Ce composant est le bouton "J'aime ce tweet" inclus dans ListTweet. Il comporte deux parties.
  Partie 1 : concernant les données de l'utilisateur qui clique sur le bouton. Elle met à jour la donnée "likedList" dans 
            la partie userList de firebase. "likedList" contient les identifiants de tous les tweets likés par l'utilisateur.
  Partie 2 : met à jour le compteur de "j'aime" du tweet concerné. La donnée qui sera mise à jour est appelée "likedCounter".
            Si celle-ci est inexistante, elle sera créée automatiquement par la requête.
*/
export default function Liked(props) {
  const { tweet, requete } = props;
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
  const likeThisTweet = async () => {
    if (!preventLikedList.includes(tweet.id)) {
      // Vérifier que le tweet en question n'est pas déjà présent dans preventLikedList
      const newDataLikedList = {
        mailUser: mailOfConnectedUser,
        pseudonymUser: pseudonymConnectedUser,
        followList: followListOfConnectedUser,
        likedList: [...preventLikedList, tweet.id],
      };
      console.log(
        "Données à envoyer à Firebase  depuis le composant Liked : ",
        newDataLikedList
      );

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
      actualiserLikedList(newDataLikedList.likedList); // Mettre à jour la liste de like dans le contexte
    }
    /* -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- -- --- -- */
    // PARTIE 2

    console.log("Fonction likeThisTweet appelée");

    // Récupère la valeur de likedCounter dans Firebase
    const response = await fetch(
      `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/${tweet.id}/likedCounter.json`
    );
    const currentLikedCounter = await response.json();

    // Incrémente la valeur actuelle de likedCounter de 1
    const newLikedCounterValue = currentLikedCounter + 1;

    // Envoi de la requête PUT pour remplacer la valeur dans Firebase
    const putResponse = await fetch(
      `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/${tweet.id}/likedCounter.json`,
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
      console.log("J'incrémente LikedCounter dans le tweet : " + tweet.title);
    }
      // Appelle la fonction requete() pour rafraîchir la liste des tweets

      props.requete();
          console.log( "ça devrait mettre à jour le nombre de cœur.");

  };
  return (
    <>
      {user ? (
        <>
          {preventLikedList.includes(tweet.id) ? (
            <GetOffLike tweet={tweet} likeThisTweet={likeThisTweet} requete={requete} />
          ) : (
        <img onClick={likeThisTweet} className="empty_like" src="../../../public/icone/empty_red.png" />
          )}
        </>
      ) : (
        <Link to="/connexion"><img className="empty_like" src="../../../public/icone/empty_red.png" /></Link>
      )}
    </>
  );
}
