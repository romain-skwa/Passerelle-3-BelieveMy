import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// Ce composant fait partie de la page AuthorPage.
// C'est sur la page AuthorPage que va être affiché les tweets d'un utilisateur après que l'on ait cliqué sur son nom

export default function AuthorTweets({ authorId }) {
  const [listeTweet, setListeTweet] = useState(); // Liste de tous les tweets de tous les utilisateurs.
  const [loading, setLoading] = useState(false);

  //----------- Fonction -----------------------------------------------------------------------------------
  const requete = async () => {
    // REQUETE pour obtenir les tweets (Les titres, les contenus, nom de l'auteur)
    setLoading(true);
    toast("Chargement...");

    // Dans la variable const donneesRecueillies, on va stocker le contenu récupéré sur Firebase
    const donneesRecueillies = await fetch(
      `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList.json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!donneesRecueillies.ok) {
      toast.error("Une erreur est survenue dans ListTweet");
      return;
    }

    const donnees = await donneesRecueillies.json();
    //console.log("Les données recueillies devraient être affichées ici ", donnees);

    // Dans la console, on peut voir que donnees contient une liste d'objets.
    // Chacun représentant un tweet. Chaque objet contient les clefs et leurs valeurs.
    // Chaque objet est précédé de son identifiant généré automatiquement par firebase.
    // Exemple... "-NsrHm6frcckAjKqIJXU":  Object { author: "Romain", content: "Contenu du tweet n° 1", title: "Tweet 1" }

    // Pour attribuer l'identifiant à chaque tweet, je dois récupérer l'identifiant généré aléatoirement par firebase.

    // Je crée une const qui va stocker l'id ET newTweet qui contient déjà : auteur, titre, contenu.
    // Pour la création, on se contente de laisser un tableau vide au début. Il sera le contenant.
    const donneesTransformees = [];
    // Avec cette boucle for in ...
    for (const key in donnees) {
      const newTweet = {
        id: key, // L'identifiant généré par firebase est maintenant une valeur de l'id que je crée
        ...donnees[key],
      };
      // push sert à ajouter dans le tableau de donneesTransformees le contenu de newTweet.
      donneesTransformees.push(newTweet);
    }
    //console.log("donnees transformees dans AuthorTweets : ", donneesTransformees);

    setListeTweet([...donneesTransformees]); // Mise à jour du state de listeTweet
    setLoading(false);
  };
  //console.log("Donnees transformees dans ListTweet. L'ensemble des tweets du site : ", listeTweet);

  const authorTweets = listeTweet ? listeTweet.filter((tweet) => tweet.author === authorId) : [];
  // Pour obtenir authorTweets, on filtre listeTweet et on stocke tous les tweets ce l'auteur ciblé

  useEffect(() => {
    requete();
  }, []);
  return (
    <div>
      <ul>
        {authorTweets.map((tweet) => (// pour afficher un par un chaque tweet
          <li key={tweet.id}>
            <section className="frameAuthorTweet">
              <p>{tweet.title}</p>
              <div>{tweet.content}</div>
            </section>
          </li>
        ))}
      </ul>
    </div>
  );
}