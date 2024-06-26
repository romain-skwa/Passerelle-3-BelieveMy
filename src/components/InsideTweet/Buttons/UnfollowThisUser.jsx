import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../store/AuthProvider";

export default function UnfollowThisUser(props) {
  // Variable
  const { tweet } = props;
  const {
    idOfConnectedUser,
    pseudonymConnectedUser,
    mailOfConnectedUser,
    followListOfConnectedUser,
    likedListOfConnectedUser,
    avatarOfTheConnectedUser,
  } = useContext(AuthContext);
  const [preventFollowList, setpreventFollowList] = useState(
    followListOfConnectedUser || []
  );

  const { actualiserListFollow } = useContext(AuthContext); // vient du contexte.

  useEffect(() => {
    setpreventFollowList(followListOfConnectedUser || []);
    return () => setpreventFollowList([]);
  }, [followListOfConnectedUser]);

  /*useEffect(() => {console.log(`Voici le contenu de preventFollowList : `, preventFollowList);}, [preventFollowList]);*/

  const deleteFollowList = async () => {
    if (preventFollowList.includes(tweet.author)) {
      // Filtrer l'auteur de la liste de suivi
      const newFollowList = preventFollowList.filter(
        // La liste des auteurs suivis une fois que l'on a enlevé l'auteur choisi
        (author) => author !== tweet.author
      );

      // Mettre à jour la liste de suivi dans Firebase
      const change = await fetch(
        `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/userList/${idOfConnectedUser}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            avatar: avatarOfTheConnectedUser,
            mailUser: mailOfConnectedUser,
            pseudonymUser: pseudonymConnectedUser,
            followList: newFollowList,
            likedList: likedListOfConnectedUser,
          }),
        }
      );

      if (!change.ok) {
        actualiserListFollow(preventFollowList); // Restaurer la copie initiale de la liste d'abonnement en cas d'erreur
        toast.error("Erreur !");
        return;
      }

      // Mettre à jour la liste de suivi dans le contexte
      actualiserListFollow(newFollowList);
      toast.success(
        "Utilisateur supprimé de la liste d'abonnement avec succès !"
      );
    } else {
      toast.info("Cet utilisateur n'est pas dans votre liste d'abonnement.");
    }
  };
  return (
    <>
      <div className="followed followButon" onClick={deleteFollowList}>
        Abonné
      </div>
    </>
  );
}
