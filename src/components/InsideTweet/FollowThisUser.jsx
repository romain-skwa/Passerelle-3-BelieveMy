import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthProvider";
import  UnfollowThisUser  from "../InsideTweet/UnfollowThisUser";

export default function FollowThisUser(props) {
  // Variable
  const { user } = useContext(AuthContext);
  const { tweet } = props;
  const {
    idOfConnectedUser,
    pseudonymConnectedUser,
    mailOfConnectedUser,
    followListOfConnectedUser,
    likedListOfConnectedUser,
  } = useContext(AuthContext);
  const [preventFollowList, setpreventFollowList] = useState(
    followListOfConnectedUser || []
  );

  const { actualiserListFollow } = useContext(AuthContext); // vient du contexte.

  const saveContent = followListOfConnectedUser; // Pour sauvegarder une copie de la liste d'abonnement de l'utilisateur.

  useEffect(() => {
    setpreventFollowList(followListOfConnectedUser || []);
    return () => setpreventFollowList([]);
  }, [followListOfConnectedUser]);

  /*useEffect(() => {console.log(`Voici le contenu de preventFollowList : `, preventFollowList);}, [preventFollowList]);*/

  const updateFollowList = async () => {
    if (!preventFollowList.includes(tweet.author)) {
      // Vérifier que l'auteur du tweet n'est pas déjà présent dans preventFollowList
      const newDataFollowList = {
        mailUser: mailOfConnectedUser,
        pseudonymUser: pseudonymConnectedUser,
        followList: [...preventFollowList, tweet.author], // contenu précédent + auteur du tweet actuel
        likedList: likedListOfConnectedUser,
      };
      console.log("Données à envoyer à Firebase :", newDataFollowList);

      const change = await fetch(
        `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/userList/${idOfConnectedUser}.json`,
        {
          method: "PUT", // La méthode PUT pour POSER de nouvelles données
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newDataFollowList), // stringify pour mettre sous forme de caractère un objet javascript
        }
      );

      if (!change.ok) {
        toast.error("Erreur !"); // Toast affiche un message d'erreur.
        setpreventFollowList(saveContent);
        return;
      }

      setpreventFollowList([...preventFollowList, tweet.author]); // pas sûr que cette soit utile finalement
      actualiserListFollow(newDataFollowList.followList); // Mettre à jour la liste dans le contexte
      //props.requete(); je crois que cette ne sert à rien
      toast.success("Utilisateur ajouté à la liste d'abonnement avec succès !");
    } else {
      toast.info("Cet utilisateur est déjà dans votre liste d'abonnement.");
    }
  };

  return (
    <>
      {
        // Pour s'assurer que le bouton "suivre" ne s'affichera pas sous un tweet écrit par l'utilisateur connecté
        // voici la condition suivante, si un utilisateur est bien connecté ET si le mail de cet utilisateur est différent du mail de l'auteur du tweet
        // alors, on affiche le bouton "suivre" ou la mention "Déjà suivi"
        user && mailOfConnectedUser !== tweet.author ? (
          <>
            {preventFollowList.includes(tweet.author) ? (
               <UnfollowThisUser tweet={tweet} />
            ) : (
              <div className="addFollow followButon" onClick={updateFollowList}>
                S'abonner 
              </div>
            )}
          </>
        ) : null
      }
    </>
  );
}
