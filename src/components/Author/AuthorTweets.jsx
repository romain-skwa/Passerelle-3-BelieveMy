import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// Ce composant fait partie de la page AuthorPage.
// C'est sur la page AuthorPage que va être affiché les tweets d'un utilisateur après que l'on ait cliqué sur son nom

import DeleteTweet from "../InsideTweet/DeleteTweet"; // Plus tard
import ChangeThisTweet from "../InsideTweet/ChangeThisTweet";
import { GetAuthorTweet } from "../GetAuthorTweet";
import { CheckUserAuthor } from "../InsideTweet/CheckUserAuthor";
import FollowThisUser from "../InsideTweet/FollowThisUser";
import Liked from "../InsideTweet/Liked";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";

export default function AuthorTweets({ authorId }) {
  const [listeTweet, setListeTweet] = useState(); // Liste de tous les tweets de tous les utilisateurs.
  const [loading, setLoading] = useState(false);
  const [frameChangeTweetState, setFrameChangeTweetState] = useState({}); /* sera changé dans la fonction handleFrameChangeTweet */
  const [changethisTweetNow, setChangethisTweetNow] = useState(false); // sera changé quand on clique sur le bouton modifier (dans le composant ChangethisTweet)
  const { user } = useContext(AuthContext);
  const [deleteNow, setDeleteNow] = useState(false); // sera changé quand on clique sur le bouton supprimer (dans le composant DeleteTweet)


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
  /*************************************************************************************************/
    // Fonction pour mettre à jour l'état de frameChangeTweetState pour un tweet spécifique
  // L'id est l'argument qui va cibler quel tweet verra son frameChangeTweetState passer de false à true ou inversement
  // Sans ce ciblage, tous les frameChangeTweetState de la page changeraient.
  // Donc, tous les tweets laisseraient apparaitre un textarea pour une éventuelle modification.

  // prevState est déconstruit en utilisant l'opérateur de propagation... pour créer une nouvelle copie du tableau frameChangeTweetState.
  // Ensuite, l'élément de frameChangeTweetState avec l'ID du tweet en argument est mis à jour en inversant sa valeur actuelle en utilisant le négaire !.
  const handleFrameChangeTweet = (id) => {
    setFrameChangeTweetState((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Ici, on change le state de frameChangeTweetState (true/false) à la ligne 138
    }));
  };

  //console.log("Donnees transformees dans ListTweet. L'ensemble des tweets du site : ", listeTweet);

  const authorTweets = listeTweet ? listeTweet.filter((tweet) => tweet.author === authorId) : [];
  // Pour obtenir authorTweets, on filtre listeTweet et on stocke tous les tweets ce l'auteur ciblé
  console.log(`authorTweets `, authorTweets);

  useEffect(() => {
    requete();
  }, []);
  return (
    <div className="affichageListeTweet">
      <ul>
        {authorTweets.map((tweet) => (// pour afficher un par un chaque tweet
          <li key={tweet.id} className="cadreTweet">
            <section>
            
            <p>{tweet.title}</p>
            <div className="cadreTweetContent">{tweet.content}</div>

            {frameChangeTweetState[tweet.id] ? (
                <>
                  <ChangeThisTweet
                    tweet={tweet}
                    changethisTweetNow={changethisTweetNow}
                    setChangethisTweetNow={setChangethisTweetNow}
                  />
                  <button onClick={() => handleFrameChangeTweet(tweet.id)}>
                    Retour
                  </button>
                </>
              ) : (
                <CheckUserAuthor
                  tweet={tweet}
                  handleFrameChangeTweet={handleFrameChangeTweet}
                />
              )}

              <div className="lineOfComponents">

                <div className="like">
                  <Liked tweet={tweet}  requete={requete} />
                  <span>{tweet.likedCounter}</span>
                </div>
                
                <div>
                  {user ? (
                    <FollowThisUser tweet={tweet} />
                  ) : null}
                </div>
              </div>

              <div>
                Écrit par <GetAuthorTweet tweet={tweet} />
                {tweet.datePublication
                  ? ", le " + tweet.datePublication
                  : " Nous n'avons pas de date concernant ce tweet."}
                {tweet.hourPublication ? " à " + tweet.hourPublication : null}.
                {tweet.modified}
              </div>

              <DeleteTweet
                tweet={tweet}
                setDeleteNow={setDeleteNow}
              ></DeleteTweet>

            </section>
          </li>
        ))}
      </ul>
    </div>
  );
}