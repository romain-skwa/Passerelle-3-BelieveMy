import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/AuthProvider";
import { GetOneIdUser } from "../components/Hello/GetOneIdUser";
import { GetAuthorTweet } from "../components/InsideTweet/GetAuthorTweet";
import { useNavigate } from 'react-router-dom';
import ListFollowed from "../components/ListFollowed";
import FollowThisUser from "../components/InsideTweet/FollowThisUser";
import Liked from "../components/InsideTweet/Liked";
import ChangeThisTweet from "../components/InsideTweet/ChangeThisTweet";
import { CheckUserAuthor } from "../components/InsideTweet/CheckUserAuthor";
import DeleteTweet from "../components/InsideTweet/DeleteTweet"; // Plus tard

/*
  Page dans laquelle on va voir la liste des auteurs suivis par l'utilisateur connecté
  ainsi que tous les tweets des auteurs suivis.
*/
export default function MyFollowedAuthors() {
  // Variable
  const { user } = useContext(AuthContext);
  const [listeTweet, setListeTweet] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [changethisTweetNow, setChangethisTweetNow] = useState(false); // sera changé quand on clique sur le bouton modifier (dans le composant ChangethisTweet)
  const [deleteNow, setDeleteNow] = useState(false); // sera changé quand on clique sur le bouton supprimer (dans le composant DeleteTweet)
  const [frameChangeTweetState, setFrameChangeTweetState] = useState({}); /* sera changé dans la fonction handleFrameChangeTweet */


  const {
    followListOfConnectedUser,
  } = useContext(AuthContext);
  
  const handleFrameChangeTweet = (id) => {
    setFrameChangeTweetState((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Ici, on change le state de frameChangeTweetState (true/false) à la ligne 138
    }));
  };
  /**************************************************************************************************/
  //----------- Fonction -----------------------------------------------------------------------------------
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

    useEffect(() => {
      requete();
    }, []);


  /**************************************************************************************************/

  // Filtre les tweets écrits par les auteurs suivis
  const tweetsSuivis = listeTweet.filter((tweet) =>
    followListOfConnectedUser ? followListOfConnectedUser.includes(tweet.author) : false
  );

//console.log(`tweetsSuivis `, tweetsSuivis)
  return (
    <div>
      <h2>
        <GetOneIdUser />
      </h2>
      La liste des auteurs que vous suivez.
      <ListFollowed />

    <div className="affichageListeTweet">

      {/* Bloc pour afficher le contenu des tweets, les titres et le noms de leur auteur*/}
      {followListOfConnectedUser && followListOfConnectedUser.length > 0 ? (
        <ul>
          {tweetsSuivis.map((tweet) => (
            <li key={tweet.id} className="cadreTweet">
             <section>
            
            <p>{tweet.title/* TITRE */}</p>
            <div className="cadreTweetContent">{tweet.content /* CONTENU */}</div>

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

              <div className="lineOfComponents">

                <div className="like" /* CONTENANT */>
                  <Liked tweet={tweet}  requete={requete} /* Cœur */ />
                  <span>{tweet.likedCounter /* COMPTEUR */ }</span>
                </div>
                
                <div>
                  {user ? (
                    <FollowThisUser tweet={tweet} /* BOUTON S'ABONNER */  />
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

              <DeleteTweet
                tweet={tweet}
                setDeleteNow={setDeleteNow}
              ></DeleteTweet>

            </section>

            </li>
          ))}
        </ul>
      ) : (
        <p>Les tweets écrits par les auteurs que vous suivrez seront affichés ici</p>
      )}
    </div>
    </div>
  );
}
