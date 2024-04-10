import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/AuthProvider";
import { GetAuthorTweet } from "./GetAuthorTweet";

export default function FollowThisUser(props) {
  // Variable
  const { user } = useContext(AuthContext);
  const { tweet, } = props;
  const { idOfConnectedUser, pseudonymConnectedUser, mailOfConnectedUser, followListOfConnectedUser } = useContext(AuthContext);
  const [preventFollowList, setpreventFollowList] = useState(followListOfConnectedUser || []);

  const { actualiserListFollow } = useContext(AuthContext); // vient du contexte.

  const saveContent = followListOfConnectedUser; // Pour sauvegarder une copie de la liste d'abonnement de l'utilisateur.

  useEffect(() => {
    setpreventFollowList(followListOfConnectedUser || []);
    return () => setpreventFollowList([]);
  }, [followListOfConnectedUser]);

/*useEffect(() => {console.log(`Voici le contenu de preventFollowList : `, preventFollowList);}, [preventFollowList]);*/

  const updateFollowList = async () => {
    // Vérifier que l'auteur du tweet n'est pas déjà présent dans preventFollowList
    if (!preventFollowList.includes(tweet.author)) {
      const newDataFollowList = {
        mailUser: mailOfConnectedUser,
        pseudonymUser: pseudonymConnectedUser,
        followList: [...preventFollowList, tweet.author], // contenu précédent + auteur du tweet actuel
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
        return;
      }

      setpreventFollowList([...preventFollowList, tweet.author]);
      actualiserListFollow(newDataFollowList.followList);// Mettre à jour la liste dans le contexte
      props.requete();
      toast.success("Utilisateur ajouté à la liste d'abonnement avec succès !");
    } else {
      toast.info("Cet utilisateur est déjà dans votre liste d'abonnement.");
    }
  };

  return (
    <>{preventFollowList.includes(tweet.author) ? 
      <p style={{ color: "green" }}>Déjà suivi</p> :
      <button onClick={updateFollowList}>Ajouter <GetAuthorTweet tweet={tweet} /> dans la liste d'abonnement</button> 
    }
    </>
  );
}