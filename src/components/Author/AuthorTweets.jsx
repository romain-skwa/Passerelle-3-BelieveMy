import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// Ce composant fait partie de la page AuthorPage.
// C'est sur la page AuthorPage que va être affiché les tweets d'un utilisateur après que l'on ait cliqué sur son nom

import DeleteTweet from "../InsideTweet/DeleteTweet"; // Plus tard
import ChangeThisTweet from "../InsideTweet/ChangeThisTweet";
import { GetAuthorTweet } from "../InsideTweet/GetAuthorTweet";
import { CheckUserAuthor } from "../InsideTweet/CheckUserAuthor";
import FollowThisUser from "../InsideTweet/Buttons/FollowThisUser";
import Liked from "../InsideTweet/Buttons/Liked";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import Avatar from "../InsideTweet/Avatar";
import Commentaries from "../InsideTweet/Commentaries";
import { Link } from "react-router-dom";

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
      `https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app/tweetList.json`,
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
  //console.log(`authorTweets `, authorTweets);

  useEffect(() => {
    requete();
  }, []);
  return (
    <div className="affichageListeTweet">
      <ul>
        {authorTweets.map((tweet) => (// pour afficher un par un chaque tweetx
          <div key={tweet.id} className="cadreTweet">
          {/*********** Avatar **** Titre ******************************************************************/}

          <section style={{ display: "flex", paddingBottom: "1rem" }}>
            <Avatar tweet={tweet} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              {tweet.title /* TITRE */}
            </div>
          </section>

          {/**** Image **********************************************************************************/}

          <section
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "1rem",
            }}
          >
            {tweet.image && tweet.image !== "" ? (
              <img
                style={{ maxWidth: "100%" }}
                src={tweet.image}
                alt="Image du tweet"
              />
            ) : null}
          </section>

          {/******** Contenu **** Modifier *** Cœur *** Like *** Date ****************************************/}

          <div className="cadreTweetContent">
            {tweet.content /* CONTENU */}
          </div>

          <div>
            <div>L&apos;id de ce tweet : {tweet.id /* ID du TWEET*/} </div>

            {/* Si le frameChangeTweetState de CE tweet === true, on affiche ChangeThisTweet et le bouton Retour.
              Sinon c'est le bouton Modifier qui sera affiché */}
            {frameChangeTweetState[tweet.id] ? (
              <>
                <ChangeThisTweet // TEXTAREA dans lequel on écrit les modifications du tweet + BOUTON d'envoi
                  tweet={tweet}
                  changethisTweetNow={changethisTweetNow}
                  setChangethisTweetNow={setChangethisTweetNow}
                />
                <button onClick={() => handleFrameChangeTweet(tweet.id)}>
                  Retour
                </button>
              </>
            ) : (
              <CheckUserAuthor // BOUTON pour faire apparaitre le textarea et CHANGER le TWEET (seulement le bouton)
                tweet={tweet}
                handleFrameChangeTweet={handleFrameChangeTweet}
              />
            )}

            {/* Cœur **** Commentaire **** S'abonner ***** */}
            <div className="lineOfComponents">
              <div className="like" /* CONTENANT */>
                <Liked tweet={tweet} requete={requete} /* Cœur */ />
                <span>{tweet.likedCounter /* COMPTEUR */}</span>
              </div>

              <div>
                {user ? (
                  <Commentaries tweet={tweet} />
                ) : (
                  <Link to="/connexion">Commentaire</Link>
                )}
              </div>

              <div>
                {user ? (
                  <FollowThisUser tweet={tweet} /* BOUTON S'ABONNER */ />
                ) : null}
              </div>
            </div>

            <div>
              Écrit par <GetAuthorTweet tweet={tweet} /* PSEUDONYME */ />
              {tweet.datePublication
                ? ", le " + tweet.datePublication
                : " Nous n'avons pas de date concernant ce tweet."}
              {tweet.hourPublication ? " à " + tweet.hourPublication : null}.
              {tweet.modified /* MENTION "MODIFIÉE" éventuelle */}
            </div>

            {/* J'envoie les props, les propriétés dans ce composant.
            Ces props permettent d'utiliser les données à l'intérieur de ce composant DeleteTweet qui fait office 
            de bouton "supprimer" */}
            <DeleteTweet
              tweet={tweet}
              setDeleteNow={setDeleteNow}
            ></DeleteTweet>
          </div>
        </div>
        ))}
      </ul>
    </div>
  );
}