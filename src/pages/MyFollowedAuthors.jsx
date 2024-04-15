import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/AuthProvider";
import { GetOneIdUser } from "../components/Hello/GetOneIdUser";
import { GetAuthorTweet } from "../components/GetAuthorTweet";
import { useNavigate } from 'react-router-dom';

export default function MyFollowedAuthors() {
  // Variable
  const { user } = useContext(AuthContext);
  const [listeTweet, setListeTweet] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    followListOfConnectedUser,
  } = useContext(AuthContext);

  /**************************************************************************************************/
  //----------- Fonction -----------------------------------------------------------------------------------
  useEffect(() => {
    const requete = async () => {
        // REQUETE pour obtenir les tweets (Les titres, les contenus, nom de l'auteur)
        setLoading(true);
        toast("Chargement...");

            // Si l'utilisateur n'est pas connecté
            if (!user) {
                navigate('/');
                return;
            }
            
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
        //console.log("donnees transformees : ", donneesTransformees);

        setListeTweet([...donneesTransformees]); // Mise à jour du state de listeTweet
        setLoading(false);
    };

    requete();
  }, []);

  /**************************************************************************************************/

  // Filtre les tweets écrits par les auteurs suivis
  const tweetsSuivis = listeTweet.filter((tweet) =>
    followListOfConnectedUser ? followListOfConnectedUser.includes(tweet.author) : false
  );

  return (
    <div>
      <h2>
        <GetOneIdUser /> Voici la liste des auteurs que vous suivez.{" "}
      </h2>
        {/* Bloc pour afficher seulement les noms des auteurs suivis */}
      {followListOfConnectedUser && followListOfConnectedUser.length > 0 ? (
        <ul>
          {followListOfConnectedUser.map((author) => (
            <li className="divAuthorFollowed" key={author}>
              {author}
              {/* Ajoutez ici les éléments que vous souhaitez afficher pour chaque auteur */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Vous n'êtes en train de suivre aucun auteur.</p>
      )}

      {/* Bloc pour afficher le contenu des tweets, les titres et le noms de leur auteur*/}
      {followListOfConnectedUser && followListOfConnectedUser.length > 0 ? (
        <ul>
          {tweetsSuivis.map((tweet) => (
            <li key={tweet.id} className="divTweetFollowed">
              <h3>{tweet.title}</h3>

              <p>{tweet.content}</p>
              <div>Écrit par <GetAuthorTweet tweet={tweet} /> </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Les tweets écrits par les auteurs que vous suivrez seront affichés ici</p>
      )}
    </div>
  );
}
