import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// DeleteTweet est le composant bouton qui se trouve dans le composant ListTweet

// Props { tweet } pour transmettre aux lignes ci-dessous les données venant du composant parent DeleteTweet
// props setDeleteNow, on change la valeur de deleteNow ici et ça va déclencher un useEffect dans le composant parent ListTweet
export default function DeleteTweet({ tweet, deleteNow, setDeleteNow }) {
  const [loading, setLoading] = useState(false); // Pour afficher l'icone de chargement

  const onDeleteThisTweet = async () => {
    // Delete
    if (window.confirm("Voulez-vous vraiment supprimer ce tweet ?")) { // Vérification
      setLoading(true);

      // Supprimer cette donnée de la base de données Firebase
      const response = await fetch(
// Les données tweet sont transmises par la props tweet plus haut. On utilise l'id inclus dans tweet pour identifer le tweet qui sera supprimé
        `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/${tweet.id}.json`,
        {
          method: "DELETE", // Méthode pour supprimer le tweet sélectionné juste au dessus
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      // Erreur
      if (!response.ok) {
        toast.error("Une erreur est intervenue.");
        setLoading(false);
        return;
      }
      setLoading(false);

      // Mettre à jour l'état deleteNow pour relancer la fonction requete
      setDeleteNow(true); /* deleteNow change.
       C'est maintenant que le 2e useffect est lancé.
       Donc la requête de récupération des tweets est exécutée.
       Donc le composant TweetList est actualisé. Seulement ce composant. Pas la page toute entière.*/
    }
  };

  return <button onClick={onDeleteThisTweet}>Supprimer {tweet.id}</button>;
}
