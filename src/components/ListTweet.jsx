import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteTweet from "../components/DeleteTweet"; // Plus tard

// Ce composant est l'enfant du parent Home.
// Il est lié à FormWriteTweet, qui est lui-même aussi un enfant de Home.

export default function ListTweet(props) {
  // props provenant de Home
  // State
  const [listeTweet, setListeTweet] = useState(props.listeTweetParent); // Liste des tweets provenant de Home grace au props
  const [loading, setLoading] = useState(false);
  const [deleteNow, setDeleteNow] = useState(false); // sera changer quand on clique sur le bouton supprimer (dans le composant DeleteTweet)

  // Fonction
  const requete = async () => { // REQUETE pour obtenir les tweets (Les titres, les contenus, nom de l'auteur)
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
      toast.error("Une erreur est survenue");
      return;
    }

    const donnees = await donneesRecueillies.json();
    console.log("Les données recueillies devraient être affichées ici ", donnees);

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
    console.log("donnees transformees : ", donneesTransformees);

    setListeTweet([...donneesTransformees]); // Mise à jour du state de listeTweet
    setLoading(false);
  };

  // Le useEffect en utilisé pour que la fonction requete ne soit exécutée que lorsqu'on le décide.
  useEffect(() => {
    requete();
  }, [props.listeTweetParent]); // Quand la liste est mise à jour, la fonction requete se lance.

  // La requête qui affiche la liste de tweet sera relancée quand on clique sur le bouton Supprimer un tweet
  useEffect(() => {
    requete(); // Le composant ListTweet dans lequel nous sommes est actualisé quand cette fonction est lancée
    setDeleteNow(false); // Le state deleteNow est remis à false maintenant que la liste de tweet est mise à jour
  }, [deleteNow]); // Élément déclencheur : changement d'état de deleteNow

  /********************************************************************************** */

  return (
    <div className="affichageListeTweet">
      <h3>Liste des tweets</h3>

      {/* la variable listeTweet contient un tableau Ce tableau va être lu en boucle par .map */}
      <ul>
        {/* Si listeTweet existe, son contenu est lu par .map*/}
        {listeTweet &&
          listeTweet.map((tweet) => (
            <li key={tweet.title}>
              {tweet.title}
              {" : "}
              {tweet.content}{" "}
            </li>
          ))}
      </ul>

      {listeTweet &&
        listeTweet.map((tweet) => (
          <div key={tweet.title} className="cadreTweet">
            <div>
              <div>{tweet.author}</div>
              <div className="cadreTweetContent">{tweet.content}</div>
              <div>L'id de ce tweet : {tweet.id} </div>
              <Link to={`tweetList/${tweet.id}`}>Modifier</Link>
              {/* J'envoie les props, les propriétés dans ce composant. Ces props permettent d'utiliser les données à l'intérieur de ce composant
DeleteTweet est le composant faisant office de bouton  "supprimer" */}
              <DeleteTweet
                tweet={tweet}
                deleteNow={deleteNow}
                setDeleteNow={setDeleteNow}
              ></DeleteTweet>
            </div>
          </div>
        ))}
    </div>
  );
}
