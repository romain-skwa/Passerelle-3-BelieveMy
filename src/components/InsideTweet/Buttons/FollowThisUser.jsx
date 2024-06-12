import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../store/AuthProvider";
import { Link } from "react-router-dom";
import UnfollowThisUser from "./UnfollowThisUser";
import { GetAuthorTweet } from "../GetAuthorTweet";

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
    avatarOfTheConnectedUser,
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
        followList: [...preventFollowList, tweet.author], // contenu précédent + auteur du tweet actuel
      };
      // console.log("Données à envoyer à Firebase :", newDataFollowList);

      const change = await fetch(
        `https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app/userList/${idOfConnectedUser}.json`,
        {
          method: "PATCH", // La méthode PUT pour POSER de nouvelles données
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
        // voici la condition suivante, si un utilisateur est bien connecté ET si le mail de cet utilisateur !== du mail de l'auteur du tweet
        // alors, on affiche le bouton "suivre" ou la mention "Abonné"

        // UTILISATEUR CONNECTÉ
        user && mailOfConnectedUser !== tweet.author ? (
          <>
            {preventFollowList.includes(tweet.author) ? ( // Si l'auteur du tweet est déjà dans la liste des auteurs suivi par l'utilisateur
              <div style={{ display: "flex" }}>
                <UnfollowThisUser tweet={tweet} />
                {/* NE PLUS SUIVRE L'AUTEUR DU TWEET */}
              </div>
            ) : (
              // Si l'utilisateur connecté n'est pas abonné, il peut cliquer sur le bouton suivant pour suivre l'auteur du tweet
              <div className="addFollow followButon" onClick={updateFollowList}>
                S&apos;abonner
              </div>
            )}
          </>
        ) : // Si l'utiliseur connecté a son mail identique à celui de l'auteur du tweet. Cela signifie qu'il est l'auteur de ce tweet. Donc on n'affiche rien.
        null
      }

      {/* UTILISATEUR CONNECTÉ */}
      {!user ? (
        <Link to="/connexion">
          {/* Si l'utilisateur n'est pas connecté mais qu'il clique, il arrivera sur la page de connexion*/}
          <div className="addFollow followButon">S&apos;abonner</div>
        </Link>
      ) : null}
    </>
  );
}
