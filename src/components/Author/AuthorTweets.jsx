import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function AuthorTweets({ authorId }) {
  //const [authorTweets, setAuthorTweets] = useState([]);
  const [listeTweet, setListeTweet] = useState(); // Liste des tweets provenant de Home grace au props
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
    // Avec cette boucle for in ... aye aye Je n'ai pas encore compris exactement comment ça marche
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
  console.log("donnees transformees dans AuthorTweets censé être ListTweet : ", listeTweet);
  const authorTweets = listeTweet ? listeTweet.filter((tweet) => tweet.author === authorId) : [];

  useEffect(() => {
    requete();
  }, []);
  return (
    <div>
      <h3>Tweets de l'auteur {authorId}</h3>
      <ul>
        {authorTweets.map((tweet) => (
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